import { Router, Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import passport from "passport";
import { authMiddleware } from "../middlewares/authMiddleware";
import crypto from "crypto";
import { getPrisma } from "../utils/getPrisma";

interface VerificationData {
  code: string;
  expiryTime: number;
  currentEmail?: string;
}

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET;

const verificationCodes: Map<string, VerificationData> = new Map();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER as string,
    pass: process.env.EMAIL_PASSWORD as string,
  },
});

const sendVerificationCode = async (email: string): Promise<string> => {
  const code = crypto.randomInt(100000, 999999).toString();
  const expiryTime = Date.now() + 10 * 60 * 1000; // 10 minutes

  verificationCodes.set(email, {
    code,
    expiryTime,
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER as string,
      to: email,
      subject: "Your Taskera Verification Code",
      text: `Your Taskera verification code is: ${code}. Valid for 10 minutes. Do not share with anyone`,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send verification email");
  }

  return code;
};

router.get("/login/success", async (req: any, res: any) => {
  if (req.user) {
    try {
      const prisma = getPrisma();
      const user = await prisma.user.upsert({
        where: { email: req.user.email },
        update: {
          username: req.user.displayName,
          email: req.user.email,
          avatar: req.user.photos[0].value || '',
        },
        create: {
          username: req.user.displayName,
          email: req.user.email,
          avatar: req.user.photos[0].value || '',
        },
      });

      const token = jwt.sign({ email: user.email }, JWT_SECRET as string, {
        expiresIn: "3h",
      });

      return res.status(200).json({
        error: false,
        message: "Successfully Logged In",
        user: user,
        token: token,
      });
      
    } catch (error) {
      console.error("Error during login success handling:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  } else {
    return res.status(403).json({ error: true, message: "Not Authorized" });
  }
});

router.get("/login/failed", (_:Request, res: Response) => {
  res.status(401).json({
    error: true,
    message: "Log in failure",
  });
  return;
});

router.get("/logout", (req:any, res:Response, next:NextFunction) => {
  req.logout((err:any) => {
    if (err) { return next(err); }
    const clientUrl = process.env.CLIENT_URL || "/";
    res.redirect(clientUrl);
  });
});

router.get("/google", passport.authenticate("google", { 
  scope: ["profile", "email"] 
}));

router.get("/google/callback",
  passport.authenticate("google", { 
      failureRedirect: `${process.env.CLIENT_URL}/signup`,
      session: false 
  }),
  (req: any, res: Response) => {
      const { token } = req.user;
      res.redirect(`${process.env.CLIENT_URL}/details?token=${token}`);
  }
);

router.post(
  "/email",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body as { email: string };
      if (!email || !email.includes("@")) {
        res.status(400).json({ error: "Invalid email" });
        return;
      }

      await sendVerificationCode(email);
      res.json({ message: "Verification code sent" });
    } catch (error) {
      res.status(500).json({ error: "Failed to send verification code" });
      console.log(error);
    }
  }
);
router.post('/validate',authMiddleware,(req:any,res:any)=>{
  try{
    const email = req.user?.email;
    if(!email){
      console.log("Unauthorized: ",email);
      return res.status(401).json({message:"Unauthorized"});
    }
    return res.status(200).json({
      ok:true,
      message:"Authorized"
    });
  }catch(e){
    console.log("Error during verifying user:",e);
    return res.status(500).json({message:"Internal Server Error"});
  }
  })

router.post(
  "/verify",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, code } = req.body as { email: string; code: string };
      const storedData = verificationCodes.get(email);

      if (!storedData || storedData.code !== code) {
        res.status(400).json({ error: "Invalid code" });
        return;
      }

      if (Date.now() > storedData.expiryTime) {
        verificationCodes.delete(email);
        res.status(400).json({ error: "Code expired" });
        return;
      }

      const prisma = await getPrisma();

      await prisma.user.upsert({
        where: { email: email },
        update: {},
        create: {
          email: email,
        },
      });

      const token = jwt.sign({ email }, process.env.JWT_SECRET as string, {
        expiresIn: "24h",
      });
      verificationCodes.delete(email);

      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: "Verification failed" });
    }
  }
);

router.put('/username', authMiddleware, async (req: any, res: any) => {
  const { username } = req.body;
  const email = req.user?.email;
  console.log(email);
  const prisma = getPrisma();

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { email: email },
      data: { username },
    });

    return res.json({ message: "Username updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating username:", error);
  }
})

router.post(
  "/change-email",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { newEmail } = req.body as { newEmail: string };
      if (!newEmail || !newEmail.includes("@")) {
        res.status(400).json({ error: "Invalid email" });
        return;
      }

      await sendVerificationCode(newEmail);

      verificationCodes.set(newEmail, {
        ...(verificationCodes.get(newEmail) as VerificationData),
        currentEmail: (req as any).user?.email,
      });
      res.json({ message: "Verification code sent to new email" });
    } catch (error) {
      res.status(500).json({ error: "Failed to initiate email change" });
    }
  }
);

router.put(
  "/change-email",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { newEmail, code } = req.body as { newEmail: string; code: string };
      const storedData = verificationCodes.get(newEmail);

      if (!storedData || storedData.code !== code) {
        res.status(400).json({ error: "Invalid code" });
        return;
      }

      if (Date.now() > storedData.expiryTime) {
        verificationCodes.delete(newEmail);
        res.status(400).json({ error: "Code expired" });
        return;
      }

      if (storedData.currentEmail !== (req as any).user?.email) {
        res.status(400).json({ error: "Unauthorized email change" });
        return;
      }

      const token = jwt.sign(
        { email: newEmail },
        process.env.JWT_SECRET as string,
        { expiresIn: "24h" }
      );
      verificationCodes.delete(newEmail);

      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: "Email change failed" });
    }
  }
);

router.get('/me',authMiddleware,async (req:any,res:any)=>{
try{
  const email = req.user!.email;
  console.log(email);
  const prisma = getPrisma();

  const user = await prisma.user.findUnique({
    where:{email: email},
    include: {
      tasks: true,
      courses: true,
    }
  })
  
  return res.status(200).json({
    user: user,
  })
  }catch(e){
    console.log("Error occured in fetching user Details", e);
    return res.status(500).json({
      message: "Internal Server Error"
    })
  }
})

export { router as authRouter };
