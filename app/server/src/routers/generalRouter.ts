import { Router, Response } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { getPrisma } from '../utils/getPrisma';

const router = Router();

router.post('/courses', authMiddleware, async (req: any, res: Response) => {
    try {
      const prisma = getPrisma();
      const { name, description, difficulty } = req.body;
   
      const course = await prisma.course.create({
        data: {
          name,
          userId: req.user!.uuid,
          description,
          difficulty,
        }
      });
   
      res.status(200).json(course);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create course' });
    }
   });
   
   router.get('/courses', authMiddleware, async (req: any, res: Response) => {
    try {
      const prisma = getPrisma();
      const courses = await prisma.course.findMany({
        where: {
            userId: req.user!.uuid
        },
        include: {
          tasks: true
        }
      });
   
      res.status(200).json(courses);
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Failed to fetch courses' });
    }
   });
   
   router.get('/courses/:id', authMiddleware, async (req: any, res: any) => {
    try {
      const prisma = getPrisma();
      const course = await prisma.course.findUnique({
        where: { id: req.params.id },
        include: {
          tasks: true,
          groups: true
        }
      });
   
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }
   
      res.json(course);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch course' });
    }
   });
   
   router.put('/courses/:id', authMiddleware, async (req: any, res: Response) => {
    try {
      const prisma = getPrisma();
      const { name, description, difficulty } = req.body;
   
      const course = await prisma.course.update({
        where: { id: req.params.id },
        data: {
          name,
          description,
          difficulty
        }
      });
   
      res.json(course);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update course' });
    }
   });
   export { router as generalRouter };