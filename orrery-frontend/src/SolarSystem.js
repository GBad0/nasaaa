//pt 3


/*import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { setupOrbitControls } from './OrbitControls';

function SolarSystem({ nearEarthObjects }) {
  const sceneRef = useRef();

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);
    sceneRef.current.appendChild(renderer.domElement);

    // Geometria e material do planeta central (exemplo)
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const planet = new THREE.Mesh(geometry, material);

    scene.add(planet);
    camera.position.z = 10;

    const controls = setupOrbitControls(camera, renderer); // Usa os controles de órbita

    // Define um tamanho mínimo padrão para os asteroides
    const asteroidSizeMin = 0.5; // Define o tamanho mínimo padrão para os asteroides

    // Adiciona asteroides baseados nos dados da API
    nearEarthObjects.forEach(neo => {
      // Definir o tamanho do asteroide com um mínimo padrão para garantir que seja visível
      const asteroidSize = Math.max(neo.estimated_diameter.kilometers.estimated_diameter_max / 10, asteroidSizeMin);

      // Geometria e material do asteroide
      const asteroidGeometry = new THREE.SphereGeometry(asteroidSize, 16, 16);
      const asteroidMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);

      // Posição baseada na distância da Terra
      const distance = parseFloat(neo.close_approach_data[0]?.miss_distance?.kilometers);
      if (!isNaN(distance)) {
        // Reduz a escala da distância para que o asteroide fique visível
        asteroid.position.set(Math.random() * distance / 10000, Math.random() * distance / 10000, Math.random() * distance / 10000);
        scene.add(asteroid);
      }
    });

    function animate() {
      requestAnimationFrame(animate);
      planet.rotation.y += 0.01;  // Animação de rotação do planeta
      controls.update();  // Atualiza os controles a cada frame
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      sceneRef.current.removeChild(renderer.domElement);
      controls.dispose();  // Limpa os controles ao desmontar o componente
    };
  }, [nearEarthObjects]);

  return <div ref={sceneRef}></div>;
}

export default SolarSystem;
*/

//pt 4

/*import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { setupOrbitControls } from './OrbitControls';

function SolarSystem({ nearEarthObjects }) {
  const sceneRef = useRef();
  const [selectedObject, setSelectedObject] = useState(null);  // Estado para armazenar o objeto clicado
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

    // Geometria e material do planeta central (exemplo)
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const planet = new THREE.Mesh(geometry, material);
    planet.userData = {
      name: 'Earth',
      distance: '0 km',
      size: '1 unit',
      hazard: 'Not hazardous',
    };
    scene.add(planet);
    clickableObjects.push(planet);  // Adiciona o planeta como objeto clicável
    camera.position.z = 10;

    const controls = setupOrbitControls(camera, renderer);

    // Define um tamanho mínimo padrão para os asteroides
    const asteroidSizeMin = 0.5;

    // Adiciona asteroides baseados nos dados da API
    nearEarthObjects.forEach(neo => {
      const asteroidSize = Math.max(neo.estimated_diameter.kilometers.estimated_diameter_max / 10, asteroidSizeMin);
      const asteroidGeometry = new THREE.SphereGeometry(asteroidSize, 16, 16);
      const asteroidMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);

      const distance = parseFloat(neo.close_approach_data[0]?.miss_distance?.kilometers);
      if (!isNaN(distance)) {
        asteroid.position.set(Math.random() * distance / 10000, Math.random() * distance / 10000, Math.random() * distance / 10000);

        // Adiciona uma "caixa de colisão" invisível para melhorar a detecção
        const boundingBox = new THREE.Box3().setFromObject(asteroid);
        const boxHelper = new THREE.Box3Helper(boundingBox, 0x00ff00);  // Ajusta a cor conforme necessário
        scene.add(boxHelper);  // Aumenta a área de detecção

        // Armazena os dados relevantes nos dados do objeto 3D
        asteroid.userData = {
          name: neo.name,
          distance: `${distance.toFixed(2)} km`,
          size: `${neo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)} km`,
          hazard: neo.is_potentially_hazardous_asteroid ? 'Hazardous' : 'Not hazardous',
        };

        scene.add(asteroid);
        clickableObjects.push(asteroid);  // Adiciona o asteroide como objeto clicável
      }
    });

    // Função para lidar com os cliques
    function onClick(event) {
      event.preventDefault();

      // Converte as coordenadas do mouse para o sistema de coordenadas 3D
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Atualiza o raycaster com as coordenadas do mouse
      raycaster.setFromCamera(mouse, camera);

      // Detecta os objetos clicados
      const intersects = raycaster.intersectObjects(clickableObjects);

      console.log("click");

      if (intersects.length > 0) {
        // Define o objeto clicado e suas informações
        setSelectedObject(intersects[0].object.userData);
        console.log("click2");
        console.log(setSelectedObject);
      }
    }

    // Adiciona o listener de clique
    window.addEventListener('click', onClick);

    function animate() {
      requestAnimationFrame(animate);
      planet.rotation.y += 0.01;  // Animação de rotação do planeta
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      sceneRef.current.removeChild(renderer.domElement);
      controls.dispose();
      window.removeEventListener('click', onClick);  // Remove o listener de clique
    };
  }, [nearEarthObjects]);

  return (
    <div>
      <div ref={sceneRef}></div>
      {selectedObject && (
        <div className="info-box">
          <h2>{selectedObject.name}</h2>
          <p><strong>Distance:</strong> {selectedObject.distance}</p>
          <p><strong>Size:</strong> {selectedObject.size}</p>
          <p><strong>Hazard:</strong> {selectedObject.hazard}</p>
        </div>
      )}
    </div>
  );
}

export default SolarSystem;*/

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { setupOrbitControls } from './OrbitControls';

function SolarSystem({ nearEarthObjects }) {
  const sceneRef = useRef();
  const [selectedObject, setSelectedObject] = useState(null);  // Estado para armazenar o objeto clicado
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

    // Geometria e material do planeta central (exemplo)
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const planet = new THREE.Mesh(geometry, material);
    planet.userData = {
      name: 'Earth',
      distance: '0 km',
      size: '1 unit',
      hazard: 'Not hazardous',
    };
    scene.add(planet);
    clickableObjects.push(planet);  // Adiciona o planeta como objeto clicável
    camera.position.z = 10;

    const controls = setupOrbitControls(camera, renderer);

    // Define um tamanho mínimo padrão para os asteroides
    const asteroidSizeMin = 0.5;

    // Adiciona asteroides baseados nos dados da API
    nearEarthObjects.forEach(neo => {
      const asteroidSize = Math.max(neo.estimated_diameter.kilometers.estimated_diameter_max / 10, asteroidSizeMin);
      const asteroidGeometry = new THREE.SphereGeometry(asteroidSize, 16, 16);
      const asteroidMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);

      const distance = parseFloat(neo.close_approach_data[0]?.miss_distance?.kilometers);
      if (!isNaN(distance)) {
        asteroid.position.set(Math.random() * distance / 10000, Math.random() * distance / 10000, Math.random() * distance / 10000);

        // Adiciona uma "caixa de colisão" invisível para melhorar a detecção
        const boundingBox = new THREE.Box3().setFromObject(asteroid);
        const boxHelper = new THREE.Box3Helper(boundingBox, 0x00ff00);  // Ajusta a cor conforme necessário
        scene.add(boxHelper);  // Aumenta a área de detecção

        // Armazena os dados relevantes nos dados do objeto 3D
        asteroid.userData = {
          name: neo.name,
          distance: `${distance.toFixed(2)} km`,
          size: `${neo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)} km`,
          hazard: neo.is_potentially_hazardous_asteroid ? 'Hazardous' : 'Not hazardous',
        };

        scene.add(asteroid);
        clickableObjects.push(asteroid);  // Adiciona o asteroide como objeto clicável
      }
    });

    // Função para lidar com os cliques
    function onClick(event) {
      event.preventDefault();

      // Obtém as dimensões e posição do elemento <main>
      const mainElement = document.querySelector('main');
      const mainRect = mainElement.getBoundingClientRect();

      // Converte as coordenadas do mouse para o sistema de coordenadas 3D relativo ao <main>
      mouse.x = ((event.clientX - mainRect.left) / mainRect.width) * 2 - 1;
      mouse.y = -((event.clientY - mainRect.top) / mainRect.height) * 2 + 1;

      // Atualiza o raycaster com as coordenadas do mouse
      raycaster.setFromCamera(mouse, camera);

      // Detecta os objetos clicados
      const intersects = raycaster.intersectObjects(clickableObjects);

      if (intersects.length > 0) {
        // Define o objeto clicado e suas informações
        setSelectedObject(intersects[0].object.userData);
      }
    }

    // Adiciona o listener de clique
    window.addEventListener('click', onClick);

    function animate() {
      requestAnimationFrame(animate);
      planet.rotation.y += 0.01;  // Animação de rotação do planeta
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      sceneRef.current.removeChild(renderer.domElement);
      controls.dispose();
      window.removeEventListener('click', onClick);  // Remove o listener de clique
    };
  }, [nearEarthObjects]);

  return (
    <div>
      <div ref={sceneRef}></div>
      {selectedObject && (
        <div className="info-box">
          <h2>{selectedObject.name}</h2>
          <p><strong>Distance:</strong> {selectedObject.distance}</p>
          <p><strong>Size:</strong> {selectedObject.size}</p>
          <p><strong>Hazard:</strong> {selectedObject.hazard}</p>
        </div>
      )}
    </div>
  );
}

export default SolarSystem;


