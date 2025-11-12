import React, { useState, useEffect } from 'react';
import { getUserId } from './getUserId';

interface WeatherData {
  temperature: number;
}

interface SavedCity {
  _id: string;
  name: string;
  userId: string;
}

const HomePage = () => {
  const [weatherData, setWeatherData] = useState<Record<string, WeatherData | null>>({});
  const [savedCities, setSavedCities] = useState<SavedCity[]>([]);
  const [isLoadingSavedWeather, setIsLoadingSavedWeather] = useState(false);
  const userId = getUserId();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(`https://ipapi.co/json/`);
        if (!response.ok) throw new Error('Failed to fetch location');
        const savedResponse = await fetch(`http://localhost:3000/cities/${userId}`);
        let current = await response.json();
        const data = await savedResponse.json();
        const currentLocation: SavedCity = {
          _id: "current-location",
          name: current.city,
          userId: "-1"
        };
        setSavedCities([currentLocation, ...data]);
      } catch (error) {
        console.error("Could not load cities:", error);
      }
    };

    fetchCities();
  }, [userId]);

  useEffect(() => {
    const fetchWeatherForCity = async () => {
      if (savedCities.length === 0) return;
      const city = savedCities[index];
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
    <main className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Weather</h1>

        {savedCities.length > 0 ? (
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              className="text-2xl font-bold text-blue-500 hover:text-blue-700 transition"
            >
              ⬅
            </button>

            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-semibold text-gray-800">
                {savedCities[index].name}
              </h2>
              <p className="text-gray-500 text-sm mt-1">Local Weather</p>

              <p className="text-6xl font-bold text-blue-600 mt-4">
                {isLoadingSavedWeather
                  ? '...'
                  : weatherData[savedCities[index]._id]
                  ? `${weatherData[savedCities[index]._id]?.temperature}°`
                  : 'N/A'}
              </p>
            </div>

            <button
              onClick={handleNext}
              className="text-2xl font-bold text-blue-500 hover:text-blue-700 transition"
            >
              ➡
            </button>
          </div>
        ) : (
          <p className="text-gray-600 mt-4">No saved locations.</p>
        )}

        <div className="flex justify-center mt-8 gap-3">
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition">
            Delete Location
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
            Save Location
          </button>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
