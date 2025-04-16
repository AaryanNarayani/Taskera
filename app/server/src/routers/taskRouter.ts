import { Router, Response } from 'express';
import { PriorityCalculator, TaskPriorityInput, TimeSlot } from '../lib/priorityCalculator';
import { authMiddleware } from '../middlewares/authMiddleware';
import { getPrisma } from '../utils/getPrisma';

interface CreateTaskRequest {
 title: string;
 type: 'ASG' | 'EXAM' | 'READING' | 'PRACTICE' | 'OTHER';
 hasReminder: boolean;
 deadline: Date;
 priority: 'HIGH' | 'MEDIUM' | 'LOW';
 courseId?: string;
 estTime: number;
 subtasks?: string[];
}

const router = Router();

router.post('/calculate-priority', authMiddleware, async (req: any, res: Response) => {
 try {
   const taskInput = req.body as TaskPriorityInput;
   const score = PriorityCalculator.calculateScore(taskInput);
   res.json({ score });
 } catch (error) {
   console.error('Priority calculation error:', error);
   res.status(500).json({ error: 'Failed to calculate priority' });
 }
});

router.post('/schedule', authMiddleware, async (req: any, res: any) => {
 const prisma = getPrisma();
 const taskInput: CreateTaskRequest = req.body;
 
 try {
   const availability = await prisma.userAvailability.findMany({
     where: { userId: req.user!.uuid }
   });

   const availableSlots: TimeSlot[] = availability.map((slot:any) => ({
     start: slot.startTime,
     end: slot.endTime,
     duration: (slot.endTime.getTime() - slot.startTime.getTime()) / (1000 * 60 * 60)
   }));

   const existingTasks = await prisma.task.findMany({
     where: { 
       userId: req.user!.uuid,
       status: { not: 'COMPLETED' }
     }
   });

   const existingTaskInputs: TaskPriorityInput[] = existingTasks.map(task => ({
     title: task.name,
     type: task.type as any,
     hasReminder: false,
     deadline: task.deadline,
     priority: task.priority as any,
     courseId: task.courseId || undefined,
     estTime: task.estTime
   }));

   const optimalSlot = PriorityCalculator.findOptimalSlot(
     {
       ...taskInput,
       title: taskInput.title
     },
     availableSlots,
     existingTaskInputs
   );

   if (!optimalSlot) {
     return res.status(400).json({ error: "No suitable time slot available" });
   }

   const newTask = await prisma.task.create({
     data: {
       userId: req.user!.uuid,
       name: taskInput.title,
       type: taskInput.type,
       priority: taskInput.priority === 'HIGH' ? 2 : taskInput.priority === 'MEDIUM' ? 1 : 0,
       estTime: taskInput.estTime,
       deadline: taskInput.deadline,
       courseId: taskInput.courseId,
       subtasks: {
         create: taskInput.subtasks?.map(name => ({ name })) || []
       }
     }
   });

   const event = await prisma.calendarEvent.create({
     data: {
       userId: req.user!.uuid,
       taskId: newTask.id,
       title: taskInput.title,
       startTime: optimalSlot.start,
       endTime: optimalSlot.end
     }
   });

   res.json({
     task: newTask,
     event,
     priorityScore: PriorityCalculator.calculateScore(taskInput)
   });

 } catch (error) {
   console.error('Task scheduling error:', error);
   res.status(500).json({ error: 'Failed to schedule task' });
 }
});

router.get('/', authMiddleware, async (req: any, res: Response) => {
 try {
   const prisma = getPrisma();
   const tasks = await prisma.task.findMany({
     where: { userId: req.user!.uuid },
     include: {
       subtasks: true,
       events: true
     }
   });

   const groupedTasks = {
     today: tasks.filter(task => {
       const event = task.events[0];
       if (!event) return false;
       const today = new Date();
       return event.startTime.toDateString() === today.toDateString();
     }),
     all: tasks
   };

   res.json(groupedTasks);
 } catch (error) {
   console.error('Error fetching tasks:', error);
   res.status(500).json({ error: 'Failed to fetch tasks' });
 }
});

router.patch('/:taskId/status', authMiddleware, async (req: any, res: Response) => {
 const { taskId } = req.params;
 const { status } = req.body;

 try {
   const prisma = getPrisma();
   const updatedTask = await prisma.task.update({
     where: { 
       id: taskId,
       userId: req.user!.uuid 
     },
     data: { status },
     include: { subtasks: true }
   });

   res.json(updatedTask);
 } catch (error) {
   console.error('Error updating task status:', error);
   res.status(500).json({ error: 'Failed to update task status' });
 }
});

router.post('/availability', authMiddleware, async (req: any, res: any) => {
  try {
    const id = req.user!.uuid;
    const { dateData } = req.body;
    
    // Transform the array of day data into the format expected by the schema
    const availabilityData = dateData.reduce((acc: any, dayData: any) => {
      const day = dayData.day.toLowerCase();
      return {
        ...acc,
        [`${day}Hours`]: dayData.hrs,
        [`${day}StartTime`]: dayData.startTime,
        [`${day}EndTime`]: dayData.endTime
      };
    }, {});
    
    const prisma = getPrisma();
    
    const result = await prisma.userAvailability.upsert({
      where: {
        userId: id
      },
      update: {
        ...availabilityData,
        updatedAt: new Date()
      },
      create: {
        userId: id,
        ...availabilityData
      }
    });
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Error saving availability:', error);
    res.status(500).json({ error: 'Failed to save availability' });
  }
});

router.get('/tasks/:id', authMiddleware, async (req: any, res: any) => {
    try {
      const prisma = getPrisma();
      const task = await prisma.task.findUnique({
        where: {
          id: req.params.id,
          userId: req.user!.uuid
        },
        include: {
          subtasks: true,
          events: true
        }
      });
   
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
   
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch task' });
    }
   });
   
   router.put('/tasks/:id', authMiddleware, async (req: any, res: Response) => {
    try {
      const prisma = getPrisma();
      const { title, type, priority, estTime, deadline, courseId, subtasks } = req.body;
   
      const updatedTask = await prisma.task.update({
        where: {
          id: req.params.id,
          userId: req.user!.uuid
        },
        data: {
          name: title,
          type,
          priority: priority === 'HIGH' ? 2 : priority === 'MEDIUM' ? 1 : 0,
          estTime,
          deadline: new Date(deadline),
          courseId,
          subtasks: {
            deleteMany: {},
            create: subtasks?.map((name:any) => ({ name })) || []
          }
        },
        include: {
          subtasks: true
        }
      });
   
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update task' });
    }
   });
   
   router.delete('/tasks/:id', authMiddleware, async (req: any, res: Response) => {
    try {
      const prisma = getPrisma();
      await prisma.task.delete({
        where: {
          id: req.params.id,
          userId: req.user!.uuid
        }
      });
   
      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete task' });
    }
   });
   
   router.patch('/tasks/:id/progress', authMiddleware, async (req: any, res: Response) => {
    try {
      const prisma = getPrisma();
      const { timeStudied } = req.body;
   
      const updatedTask = await prisma.task.update({
        where: {
          id: req.params.id,
          userId: req.user!.uuid
        },
        data: {
          timeStudied: {
            increment: timeStudied
          }
        }
      });
   
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update time studied' });
    }
});


   
export { router as taskRouter };