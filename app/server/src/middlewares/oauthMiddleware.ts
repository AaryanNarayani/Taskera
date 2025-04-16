const GoogleStrategy = require("passport-google-oauth20").Strategy;
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Profile } from 'passport-google-oauth20';
import { getPrisma } from '../utils/getPrisma';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
   throw new Error('JWT_SECRET is not defined in environment variables');
}

passport.use(
   new GoogleStrategy(
       {
           clientID: process.env.CLIENT_ID,
           clientSecret: process.env.CLIENT_SECRET,
           callbackURL: "http://localhost:3000/api/v1/auth/google/callback",
           scope: ["profile", "email"]
       },
       async function (
           _accessToken: string, 
           _refreshToken: string, 
           profile: Profile, 
           callback: (error: any, user?: any) => void
       ) {
           try {
               const prisma = getPrisma();
               const googleEmail = profile.emails?.[0].value;
               const googleAvatar = profile.photos?.[0]?.value;

               if (!googleEmail) {
                   throw new Error("No email provided from Google");
               }

               let user = await prisma.user.findFirst({
                   where: {
                       email: googleEmail
                   }
               });

               if (!user) {
                   // Create new user
                   user = await prisma.user.create({
                       data: {
                           email: googleEmail,
                           username: profile.displayName,
                           avatar: googleAvatar,
                       }
                   });
               } else {
                   // Update existing user with latest Google info
                   user = await prisma.user.update({
                       where: { email: user.email },
                       data: {
                           avatar: googleAvatar,
                       }
                   });
               }

               const token = jwt.sign(
                   { id: user.uuid, email: googleEmail }, 
                   String(JWT_SECRET),
                   { expiresIn: "3h" }
               );

               callback(null, { ...user, token });
           } catch (error) {
               console.error("Error in Google Strategy:", error);
               callback(error);
           }
       }
   )
);

// Serialize user for the session
passport.serializeUser((user: any, done) => {
   done(null, user);
});

// Deserialize user from the session
passport.deserializeUser((user: any, done) => {
   done(null, user);
});

export default passport;