import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Tooltip from 'react-tooltip-lite';

export default function PeriodTracker({ darkMode }: { darkMode: boolean }) {
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [lastPeriod, setLastPeriod] = useState<string>('2024-03-05');

  // Function to calculate future period and fertile days
  const generateCycleEvents = () => {
    const events = [];
    const periodDuration = 5;  // Average period length
    const fertileWindowStart = 10;
    const fertileWindowEnd = 15;
    const ovulationDay = 14;

    let startDate = new Date(lastPeriod);

    for (let i = 0; i < 6; i++) {
      let periodStart = new Date(startDate);
      let periodEnd = new Date(startDate);
      periodEnd.setDate(periodStart.getDate() + periodDuration);

      let fertileStart = new Date(startDate);
      fertileStart.setDate(periodStart.getDate() + fertileWindowStart);

      let fertileEnd = new Date(startDate);
      fertileEnd.setDate(periodStart.getDate() + fertileWindowEnd);

      let ovulationDate = new Date(startDate);
      ovulationDate.setDate(periodStart.getDate() + ovulationDay);

      events.push(
        { title: 'Period Start', start: periodStart, end: periodEnd, color: '#ec4899' },
        { title: 'Fertile Window', start: fertileStart, end: fertileEnd, color: '#a855f7' },
        { title: 'Ovulation', start: ovulationDate, color: '#8b5cf6' }
      );

      startDate.setDate(startDate.getDate() + cycleLength);
    }
    return events;
  };

  const events = generateCycleEvents();

  return (
    <div className={`w-full max-w-4xl mx-auto rounded-xl overflow-hidden ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    } shadow-lg p-6`}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">📅 Advanced Period Tracker</h3>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Track your cycle and get predictions for upcoming periods and fertile windows.
        </p>
      </div>

      {/* User Input for Cycle Configuration */}
      <div className="flex space-x-4 mb-4">
        <div>
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Last Period Date:
          </label>
          <input
            type="date"
            value={lastPeriod}
            onChange={(e) => setLastPeriod(e.target.value)}
            className={`p-2 rounded border ${
              darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-200 text-gray-900'
            }`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Cycle Length (days):
          </label>
          <input
            type="number"
            value={cycleLength}
            onChange={(e) => setCycleLength(Number(e.target.value))}
            className={`p-2 rounded border ${
              darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-200 text-gray-900'
            }`}
          />
        </div>
      </div>

      {/* Calendar Section */}
      <div className={`${darkMode ? 'fc-dark' : ''}`}>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth'
          }}
          height="500px"
          selectable={true}
          editable={false}
          themeSystem="standard"
          eventClick={(info) => alert(`Event: ${info.event.title}`)}
        />
      </div>

      {/* Event Legend */}
      <div className="mt-6 flex flex-wrap space-x-4">
        <Tooltip content="Your estimated period dates">
          <span className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-pink-500 mr-2"></div>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Period</span>
          </span>
        </Tooltip>

        <Tooltip content="Your fertile window for potential conception">
          <span className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-purple-500 mr-2"></div>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Fertile Window</span>
          </span>
        </Tooltip>

        <Tooltip content="The estimated ovulation day">
          <span className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-indigo-500 mr-2"></div>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Ovulation</span>
          </span>
        </Tooltip>
      </div>
    </div>
  );
}
