/*  import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import SolarSystem from './SolarSystem'; 

function App() {

  const [nearEarthObjects, setNearEarthObjects] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/')
      .then(response => console.log(response.data))
      .catch(error => console.error('Error:', error));
  }, []);

  useEffect(() => {
    const apiKey = 'JthlzqJH1vPsyZunSneW3yI9LHkLeSyd5EARSHu1';
    axios.get(`https://api.nasa.gov/neo/rest/v1/feed?start_date=2024-10-01&end_date=2024-10-05&api_key=${apiKey}`)
      .then(response => {
        console.log(response.data.near_earth_objects);
        // Atualize o estado do componente com os dados recebidos
        const objects = response.data.near_earth_objects;
        const flatObjects = Object.values(objects).flat(); // Para garantir que todos os objetos estejam em uma única lista
        setNearEarthObjects(flatObjects); 
      })
      .catch(error => console.error('Error fetching NEO data:', error));
  }, []);
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>NASA Orrery - Near Earth Objects</h1>
      </header>
      <main>
        <div className="solar-system">
          <SolarSystem />  { /* Renderiza aqui }
        </div>
      </main>
      <aside className="object-details">
        <h2>Near Earth Objects:</h2>
        <ul>
          {nearEarthObjects.map(neo => (
            <li key={neo.id}>
              <strong>{neo.name}</strong><br />
              Distance: {neo.close_approach_data[0]?.miss_distance?.kilometers} km<br />
              Size: {neo.estimated_diameter.kilometers.estimated_diameter_max} km<br />
              Dangerous: {neo.is_potentially_hazardous_asteroid}<br />
              highly collision risk: {neo.is_potentially_hazardous_asteroid}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

export default App;*/


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import SolarSystem from './SolarSystem';  // Importa o componente SolarSystem

function App() {
  const [nearEarthObjects, setNearEarthObjects] = useState([]); // Define o estado

  useEffect(() => {
    const apiKey = 'JthlzqJH1vPsyZunSneW3yI9LHkLeSyd5EARSHu1';
    axios.get(`https://api.nasa.gov/neo/rest/v1/feed?start_date=2024-10-01&end_date=2024-10-05&api_key=${apiKey}`)
      .then(response => {
        console.log(response.data.near_earth_objects);
        const objects = response.data.near_earth_objects;
        const flatObjects = Object.values(objects).flat(); // Para garantir que todos os objetos estejam em uma única lista
        setNearEarthObjects(flatObjects); // Atualiza o estado com os dados da API
      })
      .catch(error => console.error('Error fetching NEO data:', error));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>NASA Orrery - Near Earth Objects</h1>
      </header>
      <main>
        <div className="solar-system">
          {/*Passa os dados dos asteroides como props */}
          <SolarSystem nearEarthObjects={nearEarthObjects} />
        </div>
      </main>
      <aside className="object-details">
        <h2>Near Earth Objects:</h2>
        <ul>
          {nearEarthObjects.map(neo => (
            <li key={neo.id}>
              <strong>{neo.name}</strong><br />
              Distance: {neo.close_approach_data[0]?.miss_distance?.kilometers} km<br />
              Size: {neo.estimated_diameter.kilometers.estimated_diameter_max} km <br />
              Hazardous: : {neo.is_potentially_hazardous_asteroid ? 'Hazardous' : 'Not hazardous'}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

export default App;
