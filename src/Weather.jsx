import { useState, useEffect } from "react";

export default function WeatherApp() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_API_KEY

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((response) => response.json())
      .then((data) => {
        const sortedCountries = data.sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sortedCountries);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const fetchWeather = (capital) => {
    if (!capital) return;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${(capital)}&appid=${API_KEY}&units=metric`)
      .then((response) => response.json())
      .then((data) => setWeather(data))
      .catch((error) => console.error("Weather API Error:", error));
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setWeather(null);
    fetchWeather(country.capital?.[0]);
  };

  if (loading) return <p>Loading countries...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Choose Your Country</h1>
      <select defaultValue="" onChange={(e) => handleCountrySelect(countries[e.target.value])}>
  <option value="" disabled selected> -- Select Your Country -- </option>
  {countries.map((country, index) => (
    <option key={index} value={index}>
      {country.name.common}
    </option>
  ))}
</select>

      {selectedCountry && (
        <div>
          <h2>{selectedCountry.name.common}</h2>
          <p>Capital: {selectedCountry.capital?.[0]}</p>
        </div>
      )}

{weather === null && selectedCountry && <p style={{ 
    color: "gray", 
    fontStyle: "italic", 
  }}>Loading Weather Info...</p>}
{weather && (
  <div>
    <h2>Weather in {selectedCountry.capital?.[0]}</h2>
    <p>Temperature: {weather.main?.temp ?? "NA"}°C</p>
    <p>Wind Speed: {weather.wind?.speed ?? "NA"} m/s</p>
    <p>Precipitation: {weather.weather?.[0]?.description ?? "NA"}</p>
  </div>
)}
    </div>
  );
}