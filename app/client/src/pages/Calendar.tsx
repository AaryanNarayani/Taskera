import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import { useEffect, useState } from 'react'
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar'

import '@schedule-x/theme-default/dist/index.css'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop'
import { format } from 'date-fns' // Import date-fns

// Define the type for an event
interface CalendarEvent {
  id: string
  title: string
  start: string // ISO string for start time
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
    start: '2024-11-21 11:00',
    end: '2024-11-21 12:00',
  },
]

function CalendarApp() {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);

  const handleEventDrop = (droppedEvent: { event: any; start: Date; end: Date }) => {
    const { event, start, end } = droppedEvent;

    // Create a new event object with updated start and end times
    const updatedEvent = {
      ...event,
      start: start.toISOString(),
      end: end.toISOString(),
    };

    // Update the events state efficiently
    setEvents((prevEvents) =>
      prevEvents.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
    );
  };

  const plugins = [
    createEventsServicePlugin(),
    createDragAndDropPlugin({
      onDrop: handleEventDrop,
      passive: false,
    } as any), // Temporary cast to any
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

  useEffect(() => {
    calendar.eventsService.getAll()
  }, [calendar])

  return (
    <div className="flex gap-4">
      <div className="calender  w-[60vw]">
        <ScheduleXCalendar calendarApp={calendar} />
      </div>

      <div className="upcoming tasks flex flex-col b w-[30vw] gap-3 items-center pt-10">
        <div className="text-start w-[20vw] text-[30px]">
          <h1>Upcoming tasks</h1>
        </div>

        {events.map((item: CalendarEvent) => (
          <div className="w-[20vw] bg-[var(--background-2)] h-[14vh] p-5" key={item.id}>
            <h1 className="text-[20px]">{item.title}</h1>
            <h3 className="text-sm font-light">
              {/* Format updated start time */}
              {format(new Date(item.start), 'h:mm a')}
            </h3>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CalendarApp
