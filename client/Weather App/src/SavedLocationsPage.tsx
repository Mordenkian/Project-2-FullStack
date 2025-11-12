import React, { useState, useEffect, type FormEvent } from 'react';
import { getUserId } from './getUserId';

interface SavedCity {
  _id: string;
  name: string;
  userId: string;
}

const SavedLocationsPage = () => {
  const [inputCity, setInputCity] = useState('');
  const [savedCities, setSavedCities] = useState<SavedCity[]>([]);
  const userId = getUserId();

  const fetchCities = async () => {
    try {
      const response = await fetch(`http://localhost:3000/cities/${userId}`);
      const data: SavedCity[] = await response.json();
      setSavedCities(data);
    } catch (error) {
      console.error("Could not load cities:", error);
    }
  };

  // Fetch cities when the component mounts
  useEffect(() => {
    fetchCities();
  }, []);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputCity.trim()) return;

    try {
      const response = await fetch('http://localhost:3000/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: inputCity, userId: userId }),
      });
      if (response.ok) {
        setInputCity('');
        fetchCities(); // Refresh the list
      }
    } catch (error) {
      console.error("Could not save city:", error);
    }
  };

  const handleDelete = async (cityId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/cities/${cityId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        // As per our server implementation, we send the userId for verification
        body: JSON.stringify({ userId: userId }),
      });

      if (response.ok) { // A 204 No Content response is considered "ok"
        fetchCities(); // Refresh the list after successful deletion
      } else {
        console.error('Failed to delete city:', await response.json());
      }
    } catch (error) {
      console.error("Could not delete city:", error);
    }
  };
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">My Saved Places</h2>
      <form onSubmit={handleSave} className="flex gap-2 mb-6">
        <input
          type="text"
          value={inputCity}
          onChange={(e) => setInputCity(e.target.value)}
          placeholder="Enter city..."
          className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Save
        </button>
      </form>
      <ul className="space-y-3">
        {savedCities.map((city) => (
          <li
            key={city._id}
            className="flex justify-between items-center p-3 bg-gray-100 rounded-md"
          >
            <span className="text-gray-700">{city.name}</span>
            <button
              onClick={() => handleDelete(city._id)}
              className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-sm"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedLocationsPage;