import './App.css'
import { getUserId } from './getUserId';
import React, { useState, useEffect, type FormEvent } from 'react';

// --- TYPE DEFINITIONS ---
// These interfaces describe the shape of the data we expect from our state and APIs.
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

const App = () => {
  // --- STATE MANAGEMENT ---
  // State to store the detected location data
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // State to handle any errors during the fetch
  const [error, setError] = useState<string | null>(null);
  const[weatherData, setWeatherData] = useState<WeatherData | null>(null);

  const [inputCity, setInputCity] = useState('');
  const [savedCities, setSavedCities] = useState<SavedCity[]>([]);
  const userId = getUserId();

  useEffect(() => {
  
    const fetchInitialData = async () => {
      setIsLoading(true);
      fetchCities(); // Fetch saved cities right away.
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

        /* --- REAL API CALL (Commented Out) ---
         const locationKey = '7abc0787623efaa1bbd42a880632dfc7'
         const response = await fetch(`http://api.ipstack.com/check?access_key=${locationKey}&output=json`);
         if (!response.ok) throw new Error('Failed to fetch location');
         const locationData = await response.json();
         console.log("Location detected:", locationData); // Note: ipstack response might differ
         setLocationData({ city: locationData.city, region_name: locationData.region_name, country_name: locationData.country_name });
        */
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
  const fetchCities = async () => {
    try {
      const response = await fetch(`http://localhost:3000/cities/${userId}`);
      const data: SavedCity[] = await response.json();
      
      setSavedCities(data);
    } catch (error) {
      console.error("Could not load cities:", error);
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault(); // Crucial: Stops the page from refreshing!

    // Don't try to save if the box is empty
    if (!inputCity.trim()) return;

    try {
      const response = await fetch('http://localhost:3000/cities', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json', // Telling server: "I am sending JSON"
        },
        body: JSON.stringify({ name: inputCity, userId: userId }),
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
        // --- MOCK DATA FOR WEATHER ---
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockWeatherData = {
          current: { temperature: 15 } // ~59°F
        };
        console.log(`Weather (mock for ${locationData.city}):`, mockWeatherData);
        setWeatherData(mockWeatherData.current);
        // --- END MOCK DATA ---

        /* --- REAL API CALL (Commented Out) ---
         const weatherKey = "675b5dd3143ca6e34b7161c75e3f41c7"
         const response = await fetch(`http://api.weatherstack.com/current?access_key=${weatherKey}&query=${locationData.city}`);
         if (!response.ok) throw new Error('Failed to fetch weather');
         const weatherData = await response.json();
         setWeatherData(weatherData.current); */
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred during weather fetch.');
        }
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
                {locationData.city}, {locationData.region_name}
              </p>
              <p>{locationData.country_name}</p>
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
          value={inputCity}
          onChange={(e) => setInputCity(e.target.value)}
          placeholder="Enter city..."
        />
        <button type="submit">Save</button>
      </form>
      <ul>
        {savedCities.map((city) => (
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