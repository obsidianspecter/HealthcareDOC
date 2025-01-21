import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { openDB } from 'idb';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DB_NAME = 'SymptomTrackerDB';
const STORE_NAME = 'symptoms';

async function saveToDB(data: any) {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
    },
  });
  await db.put(STORE_NAME, { id: 1, data });
}

async function loadFromDB() {
  const db = await openDB(DB_NAME, 1);
  return (await db.get(STORE_NAME, 1))?.data || null;
}

export default function SymptomManager({ darkMode }: { darkMode: boolean }) {
  const initialSymptoms = {
    headache: 2,
    nausea: 1,
    fatigue: 3,
    cramps: 4,
    mood: 3,
  };

  const [symptoms, setSymptoms] = useState<{ [key: string]: number }>(initialSymptoms);
  const [, setHistory] = useState<{ symptom: string; value: number; timestamp: string }[]>([]);
  const [newSymptom, setNewSymptom] = useState('');

  useEffect(() => {
    async function loadSymptoms() {
      const savedData = await loadFromDB();
      if (savedData) setSymptoms(savedData);
    }
    loadSymptoms();
  }, []);

  useEffect(() => {
    saveToDB(symptoms);
  }, [symptoms]);

  const handleSymptomChange = (symptom: string, value: number) => {
    setSymptoms((prev) => ({
      ...prev,
      [symptom]: value,
    }));
    setHistory((prev) => [
      ...prev,
      { symptom, value, timestamp: new Date().toLocaleString() },
    ]);
  };

  const addSymptom = () => {
    if (newSymptom && !symptoms[newSymptom.toLowerCase()]) {
      setSymptoms((prev) => ({
        ...prev,
        [newSymptom.toLowerCase()]: 0,
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
    setHistory([]);
  };

  const exportData = () => {
    const dataStr = JSON.stringify(symptoms, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'symptoms_data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const importedData = JSON.parse(reader.result as string);
          setSymptoms(importedData);
        } catch (error) {
          alert('Invalid file format');
        }
      };
      reader.readAsText(file);
    }
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
          color: darkMode ? '#9ca3af' : '#4b5563',
        },
        grid: { color: darkMode ? '#374151' : '#e5e7eb' },
      },
      x: {
        ticks: { color: darkMode ? '#9ca3af' : '#4b5563' },
        grid: { display: false },
      },
    },
  };

  const data = {
    labels: Object.keys(symptoms).map((s) => s.charAt(0).toUpperCase() + s.slice(1)),
    datasets: [
      {
        data: Object.values(symptoms),
        backgroundColor: darkMode ? '#f472b6' : '#db2777',
        borderRadius: 8,
      },
    ],
  };

  return (
    <div
      className={`w-full max-w-4xl mx-auto rounded-xl overflow-hidden ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-lg p-6`}
    >
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
        <button onClick={addSymptom} className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">
          Add Symptom
        </button>
        <button onClick={exportData} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
          Export Data
        </button>
        <input type="file" accept="application/json" onChange={importData} className="hidden" />
        <button onClick={resetSymptoms} className="px-4 py-2 bg-gray-500 text-white rounded-lg">
          Reset
        </button>
      </div>
    </div>
  );
}
