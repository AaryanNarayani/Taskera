import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import { useEffect, useState, useRef } from 'react'
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar'

import '@schedule-x/theme-default/dist/index.css'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop'
import { format } from 'date-fns' 

interface CalendarEvent {
  id: string
  title: string
  start: string // ISO string for start 
  end: string // ISO string for end time
}

const initialEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'EVS OBA',
    start: '2024-11-21 15:00',
    end: '2024-11-21 16:00',
  },
  {
    id: '2',
    title: 'FAFL Assignment',
    start: '2024-11-21 17:00',
    end: '2024-11-21 05:00',
  },
  {
    id: '3',
    title: 'Hackathon',
    start: '2025-01-15 12:00',
    end: '2025-01-15 12:00',
  },
]

function CalendarApp() {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const calendarRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  // Handle resize events to update the calendar view
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleEventDrop = (droppedEvent: { event: any; start: Date; end: Date }) => {
    const { event, start, end } = droppedEvent;

    const updatedEvent = {
      ...event,
      start: start.toISOString(),
      end: end.toISOString(),
    };

    setEvents((prevEvents) =>
      prevEvents.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
    );
  };

  const plugins = [
    createEventsServicePlugin(),
    createDragAndDropPlugin({
      onDrop: handleEventDrop,
      passive: false,
    } as any), 
  ]

  const calendar = useCalendarApp({
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],
    plugins: plugins,
    events: events,
  })

  // Force calendar to re-render on window resize
  useEffect(() => {
    calendar.eventsService.getAll();
    
    // Small delay to ensure proper layout recalculation
    const timer = setTimeout(() => {
      if (calendarRef.current) {
        // This triggers a refresh of the calendar layout
        calendar.refresh();
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [calendar, windowWidth]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full p-4 md:p-6 overflow-y-scroll">
      <div 
        ref={calendarRef}
        className="calendar-container w-full lg:w-3/5 xl:w-2/3 mb-6 lg:mb-0 min-h-[500px] overflow-x-auto"
      >
        <div className="calendar-wrapper w-full h-full">
          <ScheduleXCalendar calendarApp={calendar} />
        </div>
      </div>  

      <div className="upcoming-tasks flex flex-col w-full lg:w-2/5 xl:w-1/3 gap-3 items-center lg:items-start pt-4 lg:pt-10">
        <div className="text-start w-full mb-2">
          <h1 className="text-2xl md:text-3xl font-semibold">Upcoming tasks</h1>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3">
          {events.map((item: CalendarEvent) => (
            <div 
              className="w-full bg-[var(--background-2)] p-4 rounded-xl shadow-sm" 
              key={item.id}
            >
              <h1 className="text-lg md:text-xl text-[--secondary] font-medium">{item.title}</h1>
              <h3 className="text-sm font-light mt-1">
                {format(new Date(item.start), 'h:mm a')}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CalendarApp