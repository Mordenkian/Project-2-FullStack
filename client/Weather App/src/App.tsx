import './App.css'

import React, { useState, useEffect } from 'react';

const App = () => {
  // --- STATE MANAGEMENT ---
  // State to store the detected location data
  const [locationData, setLocationData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // State to handle any errors during the fetch
  const [error, setError] = useState(null);

  const[weatherData, setWeatherData] = useState(null);

  
  const [inputCity, setInputCity] = useState('');
  const [savedCities, setSavedCities] = useState([]);
  

  useEffect(() => {
    const fetchLocation = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const locationKey = '7abc0787623efaa1bbd42a880632dfc7'

        const response = await fetch(`http://api.ipstack.com/check?access_key=${locationKey}&output=json`);
        if (!response.ok) throw new Error('Failed to fetch location');

        const locationData = await response.json();

       
        console.log("Location detected:", locationData);
        setLocationData({
          city: locationData.city || 'Unknown',
          region: locationData.region_name || 'Unknown',
          country: locationData.country_name,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocation();
  }, []);

  useEffect(() => {
    fetchCities(); // Call our helper function immediately
  }, []);
  const fetchCities = async () => {
    try {
      const response = await fetch('http://localhost:3000/cities');
      const data = await response.json();
      
      setSavedCities(data);
    } catch (error) {
      console.error("Could not load cities:", error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault(); // Crucial: Stops the page from refreshing!

    // Don't try to save if the box is empty
    if (!inputCity.trim()) return;

    try {
      // 1. Send the "letter" to the server
      const response = await fetch('http://localhost:3000/cities', {
        method: 'POST', // We are SENDING data
        headers: {
          'Content-Type': 'application/json', // Telling server: "I am sending JSON"
        },
        // 2. The actual content of the "letter"
        body: JSON.stringify({ name: inputCity }),
      });
      if (response.ok) {
        setInputCity(''); // Clear the input box (make it ready for next one)
        fetchCities();    // RE-RUN Step 2 to get the freshest list from the server
      }
    } catch (error) {
      console.error("Could not save city:", error);
    }
  };

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

  
  return (
    <div>
      
      <header>
        <h1>Weather Finder</h1>
      </header>

      
      <main>

       
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

        
        {!isLoading && !error && locationData && (
          <div>
            <div>
              <h2>Current Location</h2>
              <p>
                {locationData.city}, {locationData.region}
              </p>
              <p>{locationData.country}</p>
            </div>

          
            <div>
              <h2>Current Weather</h2>
              {weatherData ? <p>{weatherData.temperature}°</p> : <p>Loading weather...</p>}
            </div>
          </div>
        )}
        <div className="saved-cities-container">
      <h2>My Saved Places</h2>
      <form onSubmit={handleSave}>
        <input
          type="text"
          // VALUE matches "Memory 1" so React controls what's displayed
          value={inputCity}
          // ONCHANGE updates "Memory 1" every time a key is pressed
          onChange={(e) => setInputCity(e.target.value)}
          placeholder="Enter city..."
        />
        <button type="submit">Save</button>
      </form>

      {/* THE LIST connects to "Memory 2" */}
      <ul>
        {/* We LOOP through the savedCities memory to draw each one */}
        {savedCities.map((city) => (
          // MongoDB always gives us a unique '_id', perfect for the React 'key'
          <li key={city._id}>
            {city.name}
          </li>
        ))}
      </ul>
    </div>
      </main>
    </div>
  );
};

export default App;