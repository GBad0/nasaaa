import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { setupOrbitControls } from './OrbitControls';
import 'bootstrap/dist/css/bootstrap.min.css';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

function SolarSystem({ nearEarthObjects }) {
  const sceneRef = useRef();
  const [selectedObject, setSelectedObject] = useState(null);  // Estado para armazenar o objeto clicado
  const [infoBoxPosition, setInfoBoxPosition] = useState({ x: 0, y: 0 });  // Posição da info-box
  const [viewMode, setViewMode] = useState('solarSystem');
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    sceneRef.current.appendChild(renderer.domElement);

    // Array para armazenar objetos clicáveis (planeta e asteroides)
    const clickableObjects = [];

    // Geometria e material do planeta  central (exemplo)
    const geometry = new THREE.SphereGeometry(3, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const loader = new THREE.TextureLoader();
    const EarthTexture = loader.load('https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Miller-projection.jpg/800px-Miller-projection.jpg', 
      () => {
        planet.material.map = EarthTexture;
        planet.material.needsUpdate = true;
      }
    );

    const earthmaterial = new THREE.MeshBasicMaterial({ map: EarthTexture });
    const planet = new THREE.Mesh(geometry, earthmaterial);
    planet.userData = {
      name: 'Earth',
      distanceFromEarth: '0 km',
      distance: '149.600.000 km',
      size: '12.742 km',
      hazard: 'Not hazardous',
    };
    planet.position.set(0, 0, 0);
    scene.add(planet);
    clickableObjects.push(planet);
    camera.position.set(0, 0, 100);
    
    const moonGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const moonTexture = loader.load('https://i0.wp.com/picjumbo.com/wp-content/uploads/moon-surface-seamless-texture-free-photo.png?w=2210&quality=70');
    const moonMaterial = new THREE.MeshBasicMaterial({ map: moonTexture });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.userData = {
      name: 'Moon',
      distanceFromEarth: '384,400 km',
      distance: '149.600.000 km',
      size: '3,474 km',
      hazard: 'Not hazardous',
    };
    moon.position.set(6, 0, 0);  // Define uma distância da Terra
    scene.add(moon);
    clickableObjects.push(moon);

    function createSun() {
      const sunGeometry = new THREE.SphereGeometry(300, 32, 32); // Tamanho do Sol
      /*const sunMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00, // Cor amarela
        emissive: 0xffff00, // Cor de emissão (iluminação)
        emissiveIntensity: 1.5, // Intensidade da luz emitida
      });*/
      const sunTexture = loader.load('https://t3.ftcdn.net/jpg/06/44/99/06/360_F_644990656_EuN9AkavBwpkSeT2G4OGwUentsUDVEXh.jpg');
      const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
      const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
      sunMesh.position.set(600, 0, 0); // Posição do Sol em relação à Terra
      scene.add(sunMesh);
      clickableObjects.push(sunMesh);

      sunMesh.userData = {
        name: 'Sun',
        distance: '0 km',
        distanceFromEarth: '149,540,000 km',
        size: '1,392,700 km',
        hazard: 'Not hazardous',
        isPlanet: true
      };
    
      // Adiciona uma luz direcional que representa a luz do Sol
      const sunLight = new THREE.PointLight(0xffffff, 1, 100); // Luz branca
      sunLight.position.set(150, 0, 0); // Posição do Sol
      scene.add(sunLight);
    }

    function createPlanet(size, distance, textureUrl, name, distanceFromSun, sizeKm) {
      const planetGeometry = new THREE.SphereGeometry(size, 32, 32);
      const planetTexture = loader.load(textureUrl);
      const planetMaterial = new THREE.MeshBasicMaterial({ map: planetTexture });
      const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
      planetMesh.position.set(distance, 0, 0);
      planetMesh.userData = {
        name: name,
        distance: `${distanceFromSun} km`,
        size: `${sizeKm} km`,
        hazard: 'Not hazardous',
        isPlanet: true,
      };
      scene.add(planetMesh);
      clickableObjects.push(planetMesh);
    }

    createSun();

    // Criação dos planetas mais próximos com distâncias e tamanhos realistas
    /*createPlanet(1.6, 91.7, 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Mercury_in_true_color.jpg', 'Mercury', '91,700,000', '4,880');
    createPlanet(3, 41.4, 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Venus-real_color.jpg', 'Venus', '41,400,000', '12,104');
    createPlanet(2, 54.6, 'https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg', 'Mars', '54,600,000', '6,779');*/

    createPlanet(1.5,   110.7, 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Mercury_in_true_color.jpg', 'Mercury', '91,700,000', '4,880');
    createPlanet(3, -41.4, 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Venus-real_color.jpg', 'Venus', '41,400,000', '12,104');
    createPlanet(1.7, 54.6, 'https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg', 'Mars', '54,600,000', '6,779');
    createPlanet(30, -120.5, 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Jupiter_Cylindrical_Map_-_Dec_2000_PIA07782.jpg', 'Jupiter', '778,500,000', '139,822');
    createPlanet(25, -240, 'https://png.pngtree.com/thumb_back/fw800/background/20240108/pngtree-mesmerizing-texture-of-jupiter-s-surface-courtesy-of-nasa-image_13791458.png', 'Saturn', '1,427,000,000', '116,464');
    createPlanet(14, -400, 'https://t4.ftcdn.net/jpg/02/67/95/09/360_F_267950951_VfR6WvlUtMqotO7DYqNhhG5OazF7ZH8u.jpg', 'Uranus', '2,871,000,000', '50,724');
    createPlanet(14, -510, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRX75a5kyQr220PNHpqLNYp2Wec8v7QsTCc2g&s', 'Neptune', '4,495,000,000', '49,244');

    const controls = setupOrbitControls(camera, renderer);

    // Define um tamanho mínimo padrão para os asteroides
    const asteroidSizeMin = 0.5;

    // Adiciona asteroides baseados nos dados da API
    nearEarthObjects.forEach(neo => {
      const asteroidSize = Math.max(neo.estimated_diameter.kilometers.estimated_diameter_max / 10, asteroidSizeMin);
      const asteroidGeometry = new THREE.SphereGeometry(asteroidSize, 16, 16);
      const asteroidTexture = loader.load('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwgxe828wG6V5UblqT2_Ap6AAMQzn0FpAT1Q&s');
      const asteroidMaterial = new THREE.MeshBasicMaterial({ map: asteroidTexture });
      const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);

      const auraSize = asteroidSize * 8.5;  // Tamanho da aura, ajustado em relação ao asteroide
      const auraGeometry = new THREE.SphereGeometry(auraSize, 16, 16);
      const auraColor = neo.is_potentially_hazardous_asteroid ? 0xff0000 : 0xffffff;  // Vermelho se perigoso, branco se não
      const auraMaterial = new THREE.MeshBasicMaterial({
        color: auraColor,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide,
      });

      const aura = new THREE.Mesh(auraGeometry, auraMaterial);
      asteroid.add(aura);

      const distance = parseFloat(neo.close_approach_data[0]?.miss_distance?.kilometers) /10000;
      const distance1 = parseFloat(neo.close_approach_data[0]?.miss_distance?.kilometers);
      if (!isNaN(distance)) {

        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);

        const x = distance * Math.sin(phi) * Math.cos(theta);
        const y = distance * Math.sin(phi) * Math.sin(theta);
        const z = distance * Math.cos(phi);

        asteroid.position.set(x, y, z);

        asteroid.userData = {
          name: neo.name,
          distanceFromEarth: `${distance1.toFixed(2)} km`,
          size: `${neo.estimated_diameter.meters.estimated_diameter_max.toFixed(2)} m`,
          hazard: neo.is_potentially_hazardous_asteroid ? 'Hazardous' : 'Not hazardous',
          isPlanet: false,
        };
        aura.userData = asteroid.userData;

        scene.add(asteroid);
        clickableObjects.push(asteroid);
        clickableObjects.push(aura);
      }
    });

    // Função para lidar com os cliques
    function onClick(event) {
      event.preventDefault();

      const mainElement = document.querySelector('main');
      const mainRect = mainElement.getBoundingClientRect();

      // Converte as coordenadas do mouse para o sistema de coordenadas 3D relativo ao <main>
      mouse.x = ((event.clientX - mainRect.left) / mainRect.width) * 2 - 1;
      mouse.y = -((event.clientY - mainRect.top) / mainRect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Detecta os objetos clicados
      const intersects = raycaster.intersectObjects(clickableObjects);

      if (intersects.length > 0) {
        setSelectedObject(intersects[0].object.userData);

        // Define a posição da info-box com base nas coordenadas do clique
        setInfoBoxPosition({
          x: event.clientX - mainRect.left + 10,  // Ajusta a posição para a direita
          y: event.clientY - mainRect.top + 10,   // Ajusta a posição para baixo
        });
      }
    }

    window.addEventListener('click', onClick);

    function animate() {
      requestAnimationFrame(animate);
      moon.rotation.y += 0.01;    // Rotação da Lua
      planet.rotation.y += 0.001;  // Animação de rotação do planeta
      moon.position.x = 6 * Math.cos(Date.now() * 0.0005); // Movimentação da Lua em torno da Terra
      moon.position.z = 6 * Math.sin(Date.now() * 0.0005); // Circular ao redor da Terra
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    /*function updateVisibility() {
      scene.children.forEach(child => {
        // Se o child for um planeta e a visualização for apenas asteroides, ocultar
        if (viewMode === 'asteroids' && child.userData?.size) {
          child.visible = true; // Exibir apenas asteroides
        } else if (viewMode === 'solarSystem' && child.userData?.size) {
          child.visible = true; // Exibir todos os objetos
        } else {
          child.visible = false; // Ocultar outros
        }
      });
    }*/

      function updateVisibility() {
        clickableObjects.forEach(object => {
          if (viewMode === 'asteroids') {
            object.visible = !object.userData.isPlanet; // Mostrar apenas asteroides
          } else if (viewMode === 'solarSystem') {
            object.visible = object.userData.isPlanet; // Mostrar apenas planetas
          }
          else if (viewMode === 'all'){
            object.visible = object.userData ;
          }
        });
      }

    // Atualiza a visibilidade no início e quando o estado mudar
    updateVisibility(); 

    return () => {
      sceneRef.current.removeChild(renderer.domElement);
      controls.dispose();
      window.removeEventListener('click', onClick);
    };
  }, [nearEarthObjects, viewMode]);

  return (
    <div>
    <div ref={sceneRef}></div>
    <div className="d-flex justify-content-center align-items-center my-3">
      <select class="form-select w-auto" aria-label="Default select example" value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
        <option value="solarSystem">Only Solar System</option>
        <option value="asteroids">Only Asteroids</option>
        <option value="all">All</option>
      </select>
    </div>
    <div
      className="info-box"
      style={{ 
        position: 'fixed',
        top: '10px',
        right: '10px',
        backgroundColor: 'white',
        padding: '10px',
        border: '1px solid black',
        borderRadius: '5px',
        opacity: '0.8',
        zIndex: 1000,
      }}
    >
      {selectedObject ? (
        <>
          <h2>{selectedObject.name}</h2>
          {selectedObject.isPlanet ? (
            <>
              <p><strong>Distance:</strong> {selectedObject.distance}</p>
              <p><strong>Distance from earth:</strong> {selectedObject.distanceFromEarth}</p>
              <p><strong>Size:</strong> {selectedObject.size}</p>
              <p><strong>Hazard:</strong> {selectedObject.hazard}</p>
            </>
          ) : (
            // Exibe apenas a distância da Terra se não for um planeta
            <>
              <p><strong>Distance from earth:</strong> {selectedObject.distanceFromEarth}</p>
              <p><strong>Size:</strong> {selectedObject.size}</p>
              <p><strong>Hazard:</strong> {selectedObject.hazard}</p>
            </>
          )}
        </>
      ) : (
        <p>Select an object to see its information.</p>
      )}

    </div>
  </div>

  );
}

export default SolarSystem;

