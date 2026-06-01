import * as THREE from 'three';
import gsap from 'gsap';

// Ubaté coordinates
const UBATE_LAT = 5.30;
const UBATE_LON = -73.81;

// Convert Lat/Lon to a 3D Cartesian Coordinate (Vector3)
function latLonToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

export function initGlobe() {
  const canvas = document.getElementById('globeCanvas');
  const pin = document.getElementById('ubate-pin');
  
  if (!canvas) return;

  // ── RENDERER
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setClearColor(0x000000, 0);

  // ── SCENE
  const scene = new THREE.Scene();
  
  // ── CAMERA
  const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.set(0, 0, 4.5); // Initial camera position from space

  // ── LIGHTS
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);
  
  const sun = new THREE.DirectionalLight(0xffffff, 1.8);
  sun.position.set(5, 3, 5);
  scene.add(sun);

  const rimLight = new THREE.DirectionalLight(0x28C4B0, 0.6);
  rimLight.position.set(-5, -2, -3);
  scene.add(rimLight);

  // ── GLOBE (Real Texture)
  const radius = 1;
  const globeGeometry = new THREE.SphereGeometry(radius, 64, 64);
  
  // Load texture from public URL
  const textureLoader = new THREE.TextureLoader();
  const earthTexture = textureLoader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg');
  earthTexture.colorSpace = THREE.SRGBColorSpace;
  
  const globeMaterial = new THREE.MeshStandardMaterial({
    map: earthTexture,
    roughness: 0.6,
    metalness: 0.1
  });
  
  const globe = new THREE.Mesh(globeGeometry, globeMaterial);

  // Calculate Ubaté position
  const ubatePosition = latLonToVector3(UBATE_LAT, UBATE_LON, radius);

  // ── INITIAL ROTATION (Looking directly at Ubaté)
  const targetQuat = new THREE.Quaternion();
  targetQuat.setFromUnitVectors(ubatePosition.clone().normalize(), new THREE.Vector3(0, 0, 1));
  globe.quaternion.copy(targetQuat);

  const globeGroup = new THREE.Group();
  scene.add(globeGroup);
  globeGroup.add(globe);

  // ── ATMOSPHERE (glow)
  const atmosGeo = new THREE.SphereGeometry(1.04, 64, 64);
  const atmosMat = new THREE.MeshPhongMaterial({
    color: 0x4488ff,
    transparent: true,
    opacity: 0.08,
    side: THREE.FrontSide,
  });
  scene.add(new THREE.Mesh(atmosGeo, atmosMat));

  // ── STARS
  const starGeo = new THREE.BufferGeometry();
  const starCount = 1800;
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount * 3; i++) {
    starPos[i] = (Math.random() - 0.5) * 300;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.18, sizeAttenuation: true });
  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  // ── GSAP ANIMATION SEQUENCE
  canvas.classList.add('ready');
  if (pin) pin.classList.add('visible');

  const tl = gsap.timeline({ delay: 0.3 });

  // Camera zoom: far → medium
  tl.to(camera.position, {
    z: 2.8,
    duration: 2.8,
    ease: 'power2.in'
  }, 0.5);

  // Camera zoom: medium → close
  tl.to(camera.position, {
    z: 1.85,
    duration: 2,
    ease: 'power3.inOut'
  }, 3);

  // Final zoom
  tl.to(camera.position, {
    z: 1.52,
    duration: 1.5,
    ease: 'power2.out'
  }, 4.8);

  // After zoom, slight tilt
  tl.to(camera.position, {
    y: 0.12,
    x: 0.04,
    duration: 1.2,
    ease: 'power1.inOut'
  }, 5.5);

  // Animate hero text in
  tl.to('.hero-eyebrow', { opacity: 1, y: 0, duration: .6, ease: 'power2.out' }, 5.0);
  tl.to('.hero-title',   { opacity: 1, y: 0, duration: .7, ease: 'power2.out' }, 5.25);
  tl.to('.hero-sub',     { opacity: 1, y: 0, duration: .6, ease: 'power2.out' }, 5.6);
  tl.to('.hero-cta',     { opacity: 1, y: 0, duration: .5, ease: 'power2.out' }, 5.9);
  tl.to('.hero-badges',  { opacity: 1, y: 0, duration: .5, ease: 'power2.out' }, 6.1);

  gsap.set(['.hero-eyebrow','.hero-title','.hero-sub','.hero-cta','.hero-badges'], { y: 24 });

  // ── RENDER LOOP & PIN TRACKING
  let animId;
  function animate() {
    animId = requestAnimationFrame(animate);
    
    // Subtle rotation
    globeGroup.rotation.y += 0.0008;
    stars.rotation.y += 0.00005;

    renderer.render(scene, camera);

    // Update CSS Pin Position
    if (pin) {
      // Get world position of Ubaté
      const worldPos = ubatePosition.clone()
        .applyMatrix4(globe.matrixWorld)
        .applyMatrix4(globeGroup.matrixWorld);

      // Check visibility (is it behind the globe?)
      const dirToCamera = camera.position.clone().sub(worldPos).normalize();
      const normal = worldPos.clone().normalize(); // Valid because sphere is at origin
      const dot = dirToCamera.dot(normal);

      if (dot < 0) {
        // Point is on the back side of the globe
        pin.style.opacity = '0';
      } else {
        // Project to 2D
        const vector = worldPos.clone();
        vector.project(camera);

        const x = (vector.x * 0.5 + 0.5) * canvas.clientWidth;
        const y = (-(vector.y * 0.5) + 0.5) * canvas.clientHeight;

        pin.style.opacity = '1';
        pin.style.transform = `translate(-50%, -50%)`;
        pin.style.left = `${x}px`;
        pin.style.top = `${y}px`;
      }
    }
  }
  
  animate();

  // ── RESIZE
  window.addEventListener('resize', () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });

  // ── PAUSE on page hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else animate();
  });
}
