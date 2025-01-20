import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function SymptomManager({ darkMode }: { darkMode: boolean }) {
  const initialSymptoms = {
    headache: 2,
    nausea: 1,
    fatigue: 3,
    cramps: 4,
    mood: 3
  };

  const [symptoms, setSymptoms] = useState<{ [key: string]: number }>(() => {
    const savedSymptoms = localStorage.getItem('symptoms');
    return savedSymptoms ? JSON.parse(savedSymptoms) : initialSymptoms;
  });

  useEffect(() => {
    localStorage.setItem('symptoms', JSON.stringify(symptoms));
  }, [symptoms]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
          color: darkMode ? '#9ca3af' : '#4b5563'
        },
        grid: {
          color: darkMode ? '#374151' : '#e5e7eb'
        }
      },
      x: {
        ticks: {
          color: darkMode ? '#9ca3af' : '#4b5563'
        },
        grid: {
          display: false
        }
      }
    }
  };

  const data = {
    labels: Object.keys(symptoms).map(s => s.charAt(0).toUpperCase() + s.slice(1)),
    datasets: [
      {
        data: Object.values(symptoms),
        backgroundColor: darkMode ? '#f472b6' : '#db2777',
        borderRadius: 8
      }
    ]
  };

  const handleSymptomChange = (symptom: string, value: number) => {
    setSymptoms(prev => ({
      ...prev,
      [symptom]: value
    }));
  };

  const [newSymptom, setNewSymptom] = useState('');

  const addSymptom = () => {
    if (newSymptom && !symptoms[newSymptom.toLowerCase()]) {
      setSymptoms(prev => ({
        ...prev,
        [newSymptom.toLowerCase()]: 0
      }));
      setNewSymptom('');
    }
  };

  const removeSymptom = (symptom: string) => {
    const updatedSymptoms = { ...symptoms };
    delete updatedSymptoms[symptom];
    setSymptoms(updatedSymptoms);
  };

  const resetSymptoms = () => {
    setSymptoms(initialSymptoms);
  };

  return (
    <div className={`w-full max-w-4xl mx-auto rounded-xl overflow-hidden ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    } shadow-lg p-6`}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">📊 Symptom Tracker</h3>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Track your symptoms and monitor patterns over time.
        </p>
      </div>

      <div className="mb-8 h-[300px]">
        <Bar options={options} data={data} />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(symptoms).map(([symptom, value]) => (
          <div key={symptom} className="space-y-2">
            <label className="flex justify-between items-center">
              <span className="capitalize">{symptom}</span>
              <div className="flex items-center space-x-2">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{value}/5</span>
                <button
                  onClick={() => removeSymptom(symptom)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  ✖
                </button>
              </div>
            </label>
            <input
              type="range"
              min="0"
              max="5"
              value={value}
              onChange={(e) => handleSymptomChange(symptom, Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col md:flex-row items-center space-y-4 md:space-x-4">
        <input
          type="text"
          value={newSymptom}
          onChange={(e) => setNewSymptom(e.target.value)}
          placeholder="Add new symptom..."
          className={`p-2 border rounded-lg ${
            darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
          }`}
        />
        <button
          onClick={addSymptom}
          className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
        >
          Add Symptom
        </button>
        <button
          onClick={resetSymptoms}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
