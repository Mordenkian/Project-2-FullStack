import React, { useState, useEffect } from 'react';
import { getUserId } from './getUserId';

// --- TYPE DEFINITIONS ---
interface LocationData {
  city: string;
  region_name: string;
  country_name: string;
}

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
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // A single state to hold weather for the current location and all saved locations.
  // We'll use a special key "current" for the current location's weather.
  const [weatherData, setWeatherData] = useState<Record<string, WeatherData | null>>({});
  const [savedCities, setSavedCities] = useState<SavedCity[]>([]);
  const [isLoadingSavedWeather, setIsLoadingSavedWeather] = useState(false);
  const userId = getUserId();


  // Effect for fetching location
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // --- MOCK DATA FOR LOCATION ---
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        const mockLocationData = {
          city: 'Berkeley',
          region_name: 'California',
          country_name: 'United States',
        };
        console.log("Location (mock):", mockLocationData);
        setLocationData(mockLocationData);
        // --- END MOCK DATA ---
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred while fetching location.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Effect for fetching saved cities
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(`http://localhost:3000/cities/${userId}`);
        const data: SavedCity[] = await response.json();
        setSavedCities(data);
      } catch (error) {
        console.error("Could not load cities:", error);
      }
    };

    fetchCities();
  }, [userId]);

  // Effect to fetch weather for all saved cities
  useEffect(() => {
    if (savedCities.length === 0) return;

    const fetchAllWeather = async () => {
      setIsLoadingSavedWeather(true);
      const newWeatherStats: Record<string, WeatherData | null> = {};
      for (const city of savedCities) {
        try {
          // --- MOCK DATA FOR WEATHER ---
          // Simulate network delay for each city's weather fetch
          await new Promise(resolve => setTimeout(resolve, 300));
          // Generate a random temperature for variety
          const mockCityWeatherData = {
            current: { temperature: 10 + Math.floor(Math.random() * 15) }
          };
          console.log(`Weather (mock for ${city.name}):`, mockCityWeatherData);
          newWeatherStats[city._id] = mockCityWeatherData.current;
        } catch (error) {
          console.error(`Could not fetch weather for ${city.name}:`, error);
          newWeatherStats[city._id] = null; // Store null on error
        }
      }
      setWeatherData(prev => ({ ...prev, ...newWeatherStats }));
      setIsLoadingSavedWeather(false);
    };

    fetchAllWeather();
  }, [savedCities]);

  // Effect for fetching weather when location is known
  useEffect(() => {
    if (!locationData || !locationData.city) return;

    const fetchWeather = async () => {
      try {
        // --- MOCK DATA FOR WEATHER ---
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockWeatherData = {
          current: { temperature: 15 } // ~59°F
        };
        console.log(`Weather (mock for ${locationData.city}):`, mockWeatherData.current);
        setWeatherData(prev => ({
          ...prev, "current": mockWeatherData.current
        }));
        // --- END MOCK DATA ---
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred during weather fetch.');
        }
      }
    };
    fetchWeather();
  }, [locationData]);

  return (
    <main>
      {isLoading && <p>Locating you...</p>}
      {error && (
        <div>
          <p>Error: {error}</p>
          <p>Could not detect location automatically.</p>
        </div>
      )}
      {!isLoading && !error && locationData && (
        <div>
          <div>
            <h2>Current Location</h2>
            <p>{locationData.city}, {locationData.region_name}</p>
            <p>{locationData.country_name}</p>
          </div>
          <div>
            <h2>Current Weather</h2>
            {weatherData["current"] ? <p>{weatherData["current"].temperature}°</p> : <p>Loading weather...</p>}
          </div>
          <div>
            <h2>Saved Locations Weather</h2>
            {savedCities.length > 0 ? (
              <ul>
                {savedCities.map((city) => (
                  <li key={city._id}>
                    {city.name} - {
                      isLoadingSavedWeather ? '...' :
                      weatherData[city._id] ? `${weatherData[city._id]?.temperature}°` : 'N/A'
                    }
                  </li>
                ))}
              </ul>
            ) : (
              <p>No saved locations.</p>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default HomePage;