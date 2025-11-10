import React, { useState, useEffect } from 'react';

// --- TYPE DEFINITIONS ---
interface LocationData {
  city: string;
  region_name: string;
  country_name: string;
}

interface WeatherData {
  temperature: number;
}

const HomePage = () => {
  // --- STATE MANAGEMENT ---
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

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
        console.log(`Weather (mock for ${locationData.city}):`, mockWeatherData);
        setWeatherData(mockWeatherData.current);
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
            {weatherData ? <p>{weatherData.temperature}°</p> : <p>Loading weather...</p>}
          </div>
        </div>
      )}
    </main>
  );
};

export default HomePage;