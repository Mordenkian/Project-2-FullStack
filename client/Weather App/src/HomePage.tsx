import React, { useState, useEffect } from 'react';
import { getUserId } from './getUserId';

// --- TYPE DEFINITIONS ---

interface WeatherData {
  temperature: number;
}

interface SavedCity {
  _id: string;
  name: string;
  userId: string;
}

const HomePage = () => {
  // --- STATE MANAGEMENT ---
  const [weatherData, setWeatherData] = useState<Record<string, WeatherData | null>>({});
  const [savedCities, setSavedCities] = useState<SavedCity[]>([]);
  const [isLoadingSavedWeather, setIsLoadingSavedWeather] = useState(false);
  const userId = getUserId();
  const [index, setIndex] = useState(0);
  
  // Effect for fetching saved cities
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(`https://ipapi.co/json/`);
        if (!response.ok) throw new Error('Failed to fetch location');
        const savedResponse = await fetch(`http://localhost:3000/cities/${userId}`);
        let current = await response.json();
        const data = await savedResponse.json();
        const currentLocation: SavedCity = {
          _id: "current-location", // Assign a unique, stable ID
          name: current.city,      // Use 'name' to match the SavedCity interface
          userId: "-1"             // Use a string to match the type
        };
        const finaldata = [currentLocation, ...data];
        setSavedCities(finaldata);
      } catch (error) {
        console.error("Could not load cities:", error);
      }
    };

    fetchCities();
  }, [userId]);

  // Effect for fetching weather when the displayed city changes
  useEffect(() => {
    const fetchWeatherForCity = async () => {
      if (savedCities.length === 0) return;

      const city = savedCities[index];
      // Don't re-fetch if we already have the data
      if (!city || weatherData[city._id]) return;

      setIsLoadingSavedWeather(true);
      try {
        const weatherKey = "675b5dd3143ca6e34b7161c75e3f41c7";
        const response = await fetch(`http://api.weatherstack.com/current?access_key=${weatherKey}&query=${city.name}`);
        if (!response.ok) throw new Error('Failed to fetch weather');
        const newWeatherData = await response.json();
        setWeatherData(prev => ({
          ...prev,
          [city._id]: { temperature: newWeatherData.current.temperature }
        }));
      } catch (err) {
        console.error(`Could not fetch weather for ${city.name}:`, err);
        setWeatherData(prev => ({ ...prev, [city._id]: null }));
      }
      setIsLoadingSavedWeather(false);
    };

    fetchWeatherForCity();
  }, [index, savedCities, weatherData]);

  const handleNext = () => {
    if (savedCities.length === 0) return;
    setIndex((prevIndex) => (prevIndex + 1) % savedCities.length);
  };

  const handlePrev = () => {
    if (savedCities.length === 0) return;
    setIndex((prevIndex) => (prevIndex - 1 + savedCities.length) % savedCities.length);
  };

  return (
    <main>
        <div>
          <div>
            <h1>Weather</h1>
            {savedCities.length > 0 ? (
              <div>
                <button onClick={handlePrev}>Left</button>
                <div>
                  <h2>{savedCities[index].name}</h2>
                  <p>
                    {isLoadingSavedWeather ? 'Loading...' :
                     weatherData[savedCities[index]._id] ? `${weatherData[savedCities[index]._id]?.temperature}°` : 'N/A'}
                  </p>
                </div>
                <button onClick={handleNext}>Right</button>
              </div>
            ) : (
              <p>No saved locations.</p>
            )}
          </div>
        </div>
    </main>
  );
};

export default HomePage;