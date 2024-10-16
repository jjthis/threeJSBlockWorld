import * as THREE from "three";
import { PointerLockControls  } from 'three/examples/jsm/controls/PointerLockControls.js';

let scene, camera, renderer, controls, raycaster;
const pointer = new THREE.Vector2(-10000000000,-100000000000000);
const _vector = new THREE.Vector3();

const map = new THREE.TextureLoader().load( 'crate.gif' );
// const map = new THREE.TextureLoader().load( 'tmp.png' );
map.colorSpace = THREE.SRGBColorSpace;
const cubeMaterial = new THREE.MeshBasicMaterial( {  map: map } );

const cubeGeo = new THREE.BoxGeometry( 10, 10, 10 );
// const cubeMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

function onPointerDown( event ) {
  pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  
  // scene.children.filter(x=>x.type=="Mesh").map(x=>x.material.color.set(0x00ff00))
  const intersects = raycaster.intersectObjects( scene.children );
  if(intersects.length){
    const intersect=intersects[0];
    // intersect.object.material.color.set( 0xff0000 );
    const voxel = new THREE.Mesh( cubeGeo, cubeMaterial );
    voxel.position.copy( intersect.point ).add( intersect.face.normal );
    voxel.position.divideScalar(10).floor().multiplyScalar(10).addScalar(5);
    console.log(voxel.position.x+" "+voxel.position.y+" "+voxel.position.z)
    scene.add( voxel );
  }
    

  // objects.push( voxel );
}

function startFunc(){
  lockOn();
}

function initThree(){
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.addScalar(20);
  camera.position.x=0;
  camera.position.z+=30;
  renderer = new THREE.WebGLRenderer(); 
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  renderer.setClearColor( 0xffffff, 0);
  
  let light = new THREE.DirectionalLight( 0xffffff, 1 );
  light.position.set( 100, 100, 100 ).normalize();
  scene.add( light );

  raycaster = new THREE.Raycaster();

  controls = new PointerLockControls (camera,renderer.domElement);

  controls.addEventListener( 'lock', function () {
    document.querySelector("#line").style.fontSize = "4rem";
  });
  controls.addEventListener( 'unlock', function () {
    document.querySelector("#line").style.fontSize = "2rem";
  });
}

function rotate(vect,cnt){
  while(cnt){
    [vect.x,vect.z] = [vect.z,vect.x];
    vect.x*=-1;
    cnt--;
  }return vect;
}

function moveForward(distance,dir) {
  let tmp=_vector.copy(_vector);
  camera.getWorldDirection(tmp);
  _vector.y=0;
  rotate(tmp,dir);
  camera.position.addScaledVector(_vector, distance);
}

///https://webdoli.tistory.com/53
//https://devlifetestcase.tistory.com/66
//https://stackoverflow.com/questions/63405094/move-up-and-down-using-pointer-lock-controls-three-js

function lockOn(){
  controls.lock();
}



let funcArr=[];

function addCube(){
  const cube = new THREE.Mesh( cubeGeo, cubeMaterial );
  const cube2 = new THREE.Mesh( cubeGeo, cubeMaterial );
  cube.position.addScalar(5);
  cube2.position.addScalar(15);
  
  scene.add( cube );
  scene.add( cube2 );
}

function displayPosition(){
  document.querySelector("#app").textContent = `x: ${camera.position.x.toFixed(1)}, y: ${camera.position.y.toFixed(1)}, z: ${camera.position.z.toFixed(1)}`;
}

let keyList={};

function animate() {
  requestAnimationFrame( animate );
  funcArr.forEach(t=>t());
  displayPosition();
  controls.update();

  raycaster.setFromCamera( pointer, camera );

  if(keyList["w"])moveForward(1,0);
  if(keyList["d"])moveForward(1,1);
  if(keyList["s"])moveForward(1,2);
  if(keyList["a"])moveForward(1,3);
  if(keyList[" "])camera.position.y+=1;
  if(keyList["shift"])camera.position.y-=1;
  
  renderer.render( scene, camera );
}

function keyDown(x){
  keyList[x.key.toLowerCase()]=true;
}

function keyUp(x){
  delete keyList[x.key.toLowerCase()];
}

function init(){
  initThree();
  addCube();
  animate();
  window.addEventListener( 'pointerdown', onPointerDown );
  window.addEventListener('keydown',keyDown);
  window.addEventListener('keyup',keyUp);
  document.querySelector("#line").addEventListener( 'click', startFunc );
}init();