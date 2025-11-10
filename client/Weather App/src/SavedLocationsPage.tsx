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
    <div className="saved-cities-container">
      <h2>My Saved Places</h2>
      <form onSubmit={handleSave}>
        <input type="text" value={inputCity} onChange={(e) => setInputCity(e.target.value)} placeholder="Enter city..." />
        <button type="submit">Save</button>
      </form>
      <ul>
        {savedCities.map((city) => (
          <li key={city._id}>
            <span>{city.name}</span>
            <button onClick={() => handleDelete(city._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedLocationsPage;