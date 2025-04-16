import { Router, Response } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { getPrisma } from '../utils/getPrisma';

const router = Router();

router.post('/events', authMiddleware, async (req: any, res: Response) => {
 try {
   const prisma = getPrisma();
   const { taskId, title, startTime, endTime } = req.body;

   const event = await prisma.calendarEvent.create({
     data: {
       userId: req.user!.uuid,
       taskId,
       title,
       startTime: new Date(startTime),
       endTime: new Date(endTime)
     }
   });

   res.json(event);
 } catch (error) {
   res.status(500).json({ error: 'Failed to create event' });
 }
});

router.get('/events', authMiddleware, async (req: any, res: Response) => {
 try {
   const prisma = getPrisma();
   const events = await prisma.calendarEvent.findMany({
     where: { userId: req.user!.uuid },
     include: {
       task: true
     }
   });

   res.json(events);
 } catch (error) {
   res.status(500).json({ error: 'Failed to fetch events' });
 }
});

router.put('/events/:id', authMiddleware, async (req: any, res: Response) => {
 try {
   const prisma = getPrisma();
   const { title, startTime, endTime } = req.body;

   const event = await prisma.calendarEvent.update({
     where: {
       id: req.params.id,
       userId: req.user!.uuid
     },
     data: {
       title,
       startTime: new Date(startTime),
       endTime: new Date(endTime)
     }
   });

   res.json(event);
 } catch (error) {
   res.status(500).json({ error: 'Failed to update event' });
 }
});

router.delete('/events/:id', authMiddleware, async (req: any, res: Response) => {
 try {
   const prisma = getPrisma();
   await prisma.calendarEvent.delete({
     where: {
       id: req.params.id,
       userId: req.user!.uuid
     }
   });

   res.json({ message: 'Event deleted successfully' });
 } catch (error) {
   res.status(500).json({ error: 'Failed to delete event' });
 }
});

router.post('/courses', authMiddleware, async (req: any, res: Response) => {
 try {
   const prisma = getPrisma();
   const { name, description, difficulty } = req.body;

   const course = await prisma.course.create({
     data: {
       name,
       description,
       difficulty,
       users: {
         connect: { uuid: req.user!.uuid }
       }
     }
   });

   res.json(course);
 } catch (error) {
   res.status(500).json({ error: 'Failed to create course' });
 }
});

router.get('/courses', authMiddleware, async (req: any, res: Response) => {
 try {
   const prisma = getPrisma();
   const courses = await prisma.course.findMany({
     include: {
       users: true,
       tasks: true
     }
   });

   res.json(courses);
 } catch (error) {
   res.status(500).json({ error: 'Failed to fetch courses' });
 }
});

router.get('/courses/:id', authMiddleware, async (req: any, res: any) => {
 try {
   const prisma = getPrisma();
   const course = await prisma.course.findUnique({
     where: { id: req.params.id },
     include: {
       users: true,
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


export { router as calendarRouter };