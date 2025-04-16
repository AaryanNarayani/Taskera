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


export { router as calendarRouter };