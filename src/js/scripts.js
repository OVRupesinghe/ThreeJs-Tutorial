import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'; //library to create a gui

const renderer = new THREE.WebGLRenderer(); //tool that webgl uses to render 3d objects
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45, //fov
    window.innerWidth / window.innerHeight, //ascpect rati0
    0.1, //near clipping point
    1000 //far clipping point
);

const orbit = new OrbitControls(camera,renderer.domElement);

const axesHelper = new THREE.AxesHelper(3); //legend to find axes
scene.add(axesHelper);

const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

camera.position.set(-10, 30, 30); //default position is at 0,0,0 (x,y,z)
orbit.update();

//code to create a box object
const sunOrbit = new THREE.Group();
const sunGeometry = new THREE.SphereGeometry(4,50,50);
const sunMaterial = new THREE.MeshBasicMaterial({color:0xFFA500});
const sun = new THREE.Mesh(sunGeometry,sunMaterial);
sunOrbit.add(sun);
scene.add(sunOrbit);

//code to create a box object
const sphereGeometry = new THREE.SphereGeometry(2,50,50);
const sphereMaterial = new THREE.MeshBasicMaterial({color:0x00FF00,wireframe:false});
const sphere = new THREE.Mesh(sphereGeometry,sphereMaterial);
scene.add(sphere);
sphere.position.set(6,0,0);

//code to create a plane
const planeGeometry = new THREE.PlaneGeometry(30,30); //(width,height)
const planeMaterial = new THREE.MeshBasicMaterial({color:0xFFFFFF,side:THREE.DoubleSide});
const plane = new THREE.Mesh(planeGeometry,planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5*Math.PI;

const gui = new dat.GUI(); //create a gui

const options = {
    sphereGeometry
};


function animate(time){ //custom function to change camera position
    sunOrbit.rotation.x = time / 1000;
    sunOrbit.rotation.y = time / 1000;
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate); //function to loop over a animation
