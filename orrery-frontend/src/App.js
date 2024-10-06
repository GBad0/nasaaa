import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import SolarSystem from './SolarSystem';  // Importa o componente SolarSystem
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


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

  const hazardousObjects = nearEarthObjects.filter(neo => neo.is_potentially_hazardous_asteroid);

  const planets = [
    {
      name: 'Mercury',
      distance: '57.9',
      diameter: '4,880',
      image: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Mercury_in_true_color.jpg',
    },
    {
      name: 'Venus',
      distance: '108.2',
      diameter: '12,104',
      image: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Venus-real_color.jpg',
    },
    {
      name: 'Earth',
      distance: '149.6',
      diameter: '12,742',
      image: 'https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg',
    },
    {
      name: 'Mars',
      distance: '227.9',
      diameter: '6,779',
      image: 'https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg',
    },
    {
      name: 'Jupiter',
      distance: '778.3',
      diameter: '139,820',
      image: 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter.jpg',
    },
    {
      name: 'Saturn',
      distance: '1,429',
      diameter: '116,460',
      image: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_during_Equinox.jpg',
    },
    {
      name: 'Uranus',
      distance: '2,871',
      diameter: '50,724',
      image: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg',
    },
    {
      name: 'Neptune',
      distance: '4,495',
      diameter: '49,244',
      image: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Neptune_Full.jpg',
    },
  ];

  return (
    <div className="App">
      <header className="App-header">
      </header>
      <main>
        <div className="solar-system">
          {/* Passa os dados dos asteroides como props */}
          <SolarSystem nearEarthObjects={nearEarthObjects} />
        </div>
      </main>
      <div className="objects-container">
        {/* 1/3 para os Near Earth Objects */}
        <aside className="list-column">
          <h2 className='whites'>Near Earth Objects</h2>
          <div className="list-container">
            <ul>
              {nearEarthObjects.map(neo => (
                <li className='whites' key={neo.id}>
                  <strong>{neo.name}</strong><br />
                  Distance: {neo.close_approach_data[0]?.miss_distance?.kilometers} km<br />
                  Size: {neo.estimated_diameter.kilometers.estimated_diameter_max} km <br />
                  Hazardous: {neo.is_potentially_hazardous_asteroid ? 'Hazardous' : 'Not hazardous'}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* 2/3 para os Potentially Hazardous Near Earth Objects */}
        <section className="hazardous-column">
          <h2 className="hazardous-title">Potentially Hazardous Near Earth Objects <i class="bi bi-exclamation-triangle"></i></h2>
          <div className="list-container">
            <ul>
              {hazardousObjects.map(neo => (
                <li key={neo.id}>
                  <strong className='hazardous-name'>{neo.name}</strong><br />
                  Distance: {neo.close_approach_data[0]?.miss_distance?.kilometers} km<br />
                  Size: {neo.estimated_diameter.kilometers.estimated_diameter_max} km <br />
                  Hazardous: {neo.is_potentially_hazardous_asteroid ? 'Hazardous' : 'Not hazardous'}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
      {/* Seção para os planetas do Sistema Solar */}
      <div className="planets-container">
        <h2 className='whites'>Planets of the Solar System</h2>
        <div className="planets-grid">
          {planets.map(planet => (
            <div key={planet.name} className="planet-card">
              <img src={planet.image} alt={`${planet.name} 3D`} className="planet-image" />
              <div className="planet-info">
                <h3>{planet.name}</h3><br />
                <p>Distance from Sun: {planet.distance}million km</p><br />
                <p>Diameter: {planet.diameter} km</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
