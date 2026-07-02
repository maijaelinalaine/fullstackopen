import { useState } from "react";

const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const getCountryByName = async (name) => {
    const res = await fetch(`${baseUrl}/name/${encodeURIComponent(name)}`);
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error("Failed to fetch country");
    }
    return res.json();
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!query.trim()) {
      setCountry(null);
      setErrorMessage(null);
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    try {
      const foundCountry = await getCountryByName(query);
      if (!foundCountry) {
        setCountry(null);
        setErrorMessage("Country not found");
      } else {
        setCountry(foundCountry);
      }
    } catch (error) {
      console.error("Error fetching country by name:", error);
      setCountry(null);
      setErrorMessage("Request failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <label>
          Find countries
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <button type="submit">search</button>
      </form>
      {loading ? <p>Loading...</p> : null}
      {errorMessage ? <p>{errorMessage}</p> : null}
      {country ? (
        <div>
          <h2>{country.name.common}</h2>
          <p>Capital: {country.capital?.[0] ?? "N/A"}</p>
          <p>Area: {country.area}</p>
          <h3>Languages</h3>
          <ul>
            {Object.values(country.languages ?? {}).map((language) => (
              <li key={language}>{language}</li>
            ))}
          </ul>
          <img
            src={country.flags?.png}
            alt={`Flag of ${country.name.common}`}
            width="160"
          />
        </div>
      ) : null}
    </div>
  );
};

export default App;
