let scene, camera, renderer, controls, model;

init();
loadModel();

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';

// 前面我寫的 init, loadModel, exportModel, animate 等函式就可以直接用

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x222222);

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 1.5, 3);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight * 0.8);
  document.getElementById("viewer").appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);

  const light = new THREE.HemisphereLight(0xffffff, 0x444444);
  light.position.set(0, 20, 0);
  scene.add(light);

  const dirLight = new THREE.DirectionalLight(0xffffff);
  dirLight.position.set(3, 10, 10);
  scene.add(dirLight);

  window.addEventListener('resize', onWindowResize);
  animate();
}

function loadModel() {
  const loader = new THREE.GLTFLoader();
  loader.load('assets/SCAR.glb', (gltf) => {
    model = gltf.scene;
    scene.add(model);

    document.getElementById("scaleX").addEventListener("input", (e) => {
      model.scale.x = parseFloat(e.target.value);
    });
    document.getElementById("scaleY").addEventListener("input", (e) => {
      model.scale.y = parseFloat(e.target.value);
    });
    document.getElementById("scaleZ").addEventListener("input", (e) => {
      model.scale.z = parseFloat(e.target.value);
    });

    document.getElementById("download").addEventListener("click", exportModel);
  });
}

function exportModel() {
  const exporter = new THREE.GLTFExporter();
  exporter.parse(model, (gltf) => {
    const blob = new Blob([gltf], { type: 'model/gltf-binary' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'model.glb';
    a.click();
    URL.revokeObjectURL(url);
  }, { binary: true });
}

function onWindowResize() {
  camera.aspect = window.innerWidth / (window.innerHeight * 0.8);
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight * 0.8);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
