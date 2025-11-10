import './App.css'

import React, { useState, useEffect } from 'react';

const App = () => {
  // --- STATE MANAGEMENT ---
  // State to store the detected location data
  const [locationData, setLocationData] = useState(null);
  // State to handle loading status while fetching
  const [isLoading, setIsLoading] = useState(true);
  // State to handle any errors during the fetch
  const [error, setError] = useState(null);

  const[weatherData, setWeatherData] = useState(null);

  // --- EFFECTS ---
  // useEffect with an empty dependency array [] runs ONLY once when the component mounts.
  useEffect(() => {
    const fetchLocation = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const locationKey = '7abc0787623efaa1bbd42a880632dfc7'

        const response = await fetch(`http://api.ipstack.com/check?access_key=${locationKey}&output=json`);
        if (!response.ok) throw new Error('Failed to fetch location');

        const locationData = await response.json();

        // Once we have data, update state
        console.log("Location detected:", locationData); // For debugging
        setLocationData({
          city: locationData.city || 'Unknown',
          region: locationData.region_name || 'Unknown',
          country: locationData.country_name,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        // Always turn off loading spinner, success or fail
        setIsLoading(false);
      }
    };

    fetchLocation();
  }, []); // Empty dependency array, so it runs only once on mount.

  // This effect runs whenever locationData changes
  useEffect(() => {
    if (!locationData || !locationData.city) return;
    
    const fetchWeather = async () => {
      try {
        const weatherKey = "675b5dd3143ca6e34b7161c75e3f41c7"
        const response = await fetch(`http://api.weatherstack.com/current?access_key=${weatherKey}&query=${locationData.city}`);
        if (!response.ok) throw new Error('Failed to fetch weather');
        const weatherData = await response.json();
        setWeatherData({
          temperature: weatherData.current.temperature
        })
      } catch (err: any) {
        setError(err.message);
      }
    }
    fetchWeather();
  }, [locationData]); // Dependency on locationData

  // --- RENDERING ---
  return (
    <div>
      {/* Header */}
      <header>
        <h1>Weather Finder</h1>
        <p>Framework v1.0</p>
      </header>

      {/* Main Content Card */}
      <main>

        {/* Conditional Rendering based on state */}
        {isLoading && (
          <div>
             <div></div>
             <p>Locating you...</p>
          </div>
        )}

        {error && (
          <div>
            <p>Error: {error}</p>
            <p>Could not detect location automatically.</p>
          </div>
        )}

        {/* Successfully loaded location */}
        {!isLoading && !error && locationData && (
          <div>
            <div>
              <h2>Current Location</h2>
              <p>
                {locationData.city}, {locationData.region}
              </p>
              <p>{locationData.country}</p>
            </div>

            {/* Placeholder for where actual weather data will go */}
            <div>
              <h2>Current Weather</h2>
              {weatherData ? <p>{weatherData.temperature}°</p> : <p>Loading weather...</p>}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;