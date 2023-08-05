import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import sunTexture from '../img/sun.jpg';
import saturnTexture from '../img/saturn.jpg';
import { TextureLoader } from 'three';
import bkg1_back from '../img/bkg1_back.png';
import bkg1_front from '../img/bkg1_front.png';
import bkg1_left from '../img/bkg1_left.png';
import bkg1_right from '../img/bkg1_right.png';
import bkg1_top from '../img/bkg1_top.png';
import bkg1_bottom from '../img/bkg1_bot.png';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import rings from '../img/rings.png';
import moon1Img from '../img/moon1.jpg'; 
import moon2Img from '../img/moon2.jpg';
import moon3Img from '../img/moon3.jpg';
import moon4Img from '../img/moon4.jpg';
import asteroidImg from '../img/asteroid.jpg';

//shadow effects
const renderer = new THREE.WebGLRenderer(); 
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.shadowMap.enabled = true; 

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45, //fov
    window.innerWidth / window.innerHeight, //ascpect rati0
    0.1, //near clipping point
    1000 //far clipping point
);

const orbit = new OrbitControls(camera,renderer.domElement);
camera.position.set(-10, 30, 30); //default position is at 0,0,0 (x,y,z)
orbit.update();

//code to create sun
const textureLoader = new THREE.TextureLoader();
const sunGeometry = new THREE.SphereGeometry(20,100,100);
const sunMaterial = new THREE.MeshBasicMaterial({
    map: textureLoader.load(sunTexture)
});
const sun= new THREE.Mesh(sunGeometry,sunMaterial);
scene.add(sun);
sun.position.set(0,0,1000);
sun.castShadow = false;

//code to create saturn
const saturnGeometry = new THREE.SphereGeometry(7,50,50);
const saturnMaterial = new THREE.MeshStandardMaterial({
    map: textureLoader.load(saturnTexture),
});
const saturn = new THREE.Mesh(saturnGeometry,saturnMaterial);
scene.add(saturn);
saturn.castShadow = true;
saturn.receiveShadow = true;
saturn.rotation.x = 1.2*Math.PI;

//code to create a ring for saturn
const ringGeometry = new THREE.RingGeometry(8,16,100);
const ringMaterial = new THREE.MeshBasicMaterial({
    side:THREE.DoubleSide,
    map: textureLoader.load(rings),
});
const ring = new THREE.Mesh(ringGeometry,ringMaterial);
ring.rotation.x = 0.7*Math.PI;
scene.add(ring);
ring.receiveShadow = true;

//adding moons
const moon1 = new THREE.SphereGeometry(1,50,50);
const moon1Material = new THREE.MeshStandardMaterial({
    map: textureLoader.load(moon1Img),
});
const moon1Mesh = new THREE.Mesh(moon1,moon1Material);
moon1Mesh.position.set(0,0,20); 
moon1.castShadow = true;
moon1.receiveShadow = true;
saturn.add(moon1Mesh);

const moon2 = new THREE.SphereGeometry(0.5,50,50);
const moon2Material = new THREE.MeshStandardMaterial({
    map: textureLoader.load(moon2Img),
});
const moon2Mesh = new THREE.Mesh(moon2,moon2Material);
moon2Mesh.position.set(22,0,-20);
moon2.castShadow = true;
moon2.receiveShadow = true;
saturn.add(moon2Mesh);

const moon3 = new THREE.SphereGeometry(0.5,50,50);
const moon3Material = new THREE.MeshStandardMaterial({
    map: textureLoader.load(moon3Img),
});
const moon3Mesh = new THREE.Mesh(moon3,moon3Material);
moon3Mesh.position.set(23,0,20);
moon3.castShadow = true;
moon3.receiveShadow = true;
saturn.add(moon3Mesh);

const moon4 = new THREE.SphereGeometry(0.5,50,50);
const moon4Material = new THREE.MeshStandardMaterial({
    map: textureLoader.load(moon4Img),
});
const moon4Mesh = new THREE.Mesh(moon4,moon4Material);
moon4Mesh.position.set(-20,0,0);
moon4.castShadow = true;
moon4.receiveShadow = true;
saturn.add(moon4Mesh);

//adding 3d models to the scene

//loading 3d models
const spaceShip = new URL('../assets/source/shuttle.glb', import.meta.url);
const alienShip = new URL('../assets/alienShip.glb', import.meta.url);
const assetLoader = new GLTFLoader();

//add spaceship
assetLoader.load(spaceShip.href, function(gltf){
    const model = gltf.scene;
    scene.add(model);
    model.position.set(0,0,18);
    model.scale.set(0.05, 0.05, 0.05);
    model.rotation.y = -0.5*Math.PI;
    model.rotation.x = -0.1*Math.PI;
    //animate spaceship
    const animate = function(){
        requestAnimationFrame(animate);
        model.position.z += 0.02;
    }
    animate();
    
}, undefined, function(error){
    console.error(error);
});

//add alien ship
assetLoader.load(alienShip.href, function(gltf){
    const model = gltf.scene;
    scene.add(model);
    model.position.set(20,-20,80);
    model.scale.set(1, 1, 1);
    model.rotation.y = 1*Math.PI;
    model.rotation.x = 0.1*Math.PI;
    //animate spaceship
    const animate = function(){
        requestAnimationFrame(animate);
        model.position.z -= 0.03;
    }
    animate();
    
}, undefined, function(error){
    console.error(error);
});

//lighting effects
const directionalLight = new THREE.DirectionalLight(0xFFFFFF);
directionalLight.position.set(0,0,50);
scene.add(directionalLight);
directionalLight.castShadow = true;

//creating skybox 
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    bkg1_right,   // Positive X
    bkg1_left,    // Negative X
    bkg1_top,     // Positive Y
    bkg1_bottom,  // Negative Y
    bkg1_front,   // Positive Z
    bkg1_back     // Negative Z
]);

//code to create randomised asteroids
function createAsteroid(texture) {
    const asteroidGeometry = new THREE.SphereGeometry(0.2, 20, 20);
    const asteroidMaterial = new THREE.MeshStandardMaterial({
        map: texture,
    });
    const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);

    
    asteroid.position.set(
        Math.random() * 100 - 50, 
        Math.random() * 20 - 10,  
        Math.random() * 100 - 50  
    );

    const scale = Math.random() * 0.5 + 0.3; 
    asteroid.scale.set(scale, scale, scale);

    return asteroid;
}

const particleCount = 60;
const particles = new THREE.Group();
for (let i = 0; i < particleCount; i++) {
    const asteroidTexture = textureLoader.load(asteroidImg); // Use the same texture as asteroids
    const particleAsteroid = createAsteroid(asteroidTexture);

    particles.add(particleAsteroid);
}
scene.add(particles);

//animation effects
function animate(time){ 
    saturn.rotation.y = time / 2000;
    sun.rotation.y = time / 2000;
    ring.rotation.z = time / 2000;
    moon1Mesh.rotation.y = time / 2000;
    moon2Mesh.rotation.y = time / 2000;
    moon3Mesh.rotation.y = time / 2000;
    moon4Mesh.rotation.y = time / 2000;
    particles.children.forEach((particle) => {
        particle.position.x += 0.05; 
        if (particle.position.x > 50) {
            particle.position.x = -50; 
        }
    });
    renderer.render(scene, camera);
}


renderer.setAnimationLoop(animate); 

//responsiveness handler
window.addEventListener('resize',function(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
});