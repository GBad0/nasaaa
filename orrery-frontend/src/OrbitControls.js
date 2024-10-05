import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export function setupOrbitControls(camera, renderer) {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = true;  // Ativa o zoom
  controls.enablePan = false;  // Desativa o movimento de pan
  return controls;
}