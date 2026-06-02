import * as THREE from 'three';
import gsap from 'gsap';

// Coordenadas originales y exactas
const UBATE_LAT = 5.30;
const UBATE_LON = -73.81;

// Matemática original (sin offsets que dañen la posición)
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

  // 1. RENDERER SIMPLE BASADO EN LA VENTANA
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight); // Forzamos el tamaño real de la pantalla
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 6);

  // Luces
  scene.add(new THREE.AmbientLight(0xffffff, 2.5));
  const sun = new THREE.DirectionalLight(0xffffff, 5.0);
  sun.position.set(5, 3, 5);
  scene.add(sun);
  const rimLight = new THREE.DirectionalLight(0x28C4B0, 0.8);
  rimLight.position.set(-5, -2, -3);
  scene.add(rimLight);

  // Globo
  const radius = 1;
  const globeGeometry = new THREE.SphereGeometry(radius, 128, 128);
  const earthTexture = new THREE.TextureLoader().load('/earth-blue-marble.jpg');
  earthTexture.colorSpace = THREE.SRGBColorSpace;
  earthTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  earthTexture.generateMipmaps = true;
  earthTexture.minFilter = THREE.LinearMipmapLinearFilter;

  const globeMaterial = new THREE.MeshStandardMaterial({ map: earthTexture, roughness: 0.6, metalness: 0.1 });
  const globe = new THREE.Mesh(globeGeometry, globeMaterial);

  const globeGroup = new THREE.Group();
  scene.add(globeGroup);
  globeGroup.add(globe);

  // Posición inicial antes del giro
  globeGroup.rotation.y = -Math.PI * 0.8;
  globeGroup.rotation.x = 0.2;

  // Atmósfera y Estrellas
  const atmosGeo = new THREE.SphereGeometry(1.04, 64, 64);
  const atmosMat = new THREE.MeshPhongMaterial({ color: 0x4488ff, transparent: true, opacity: 0.08, side: THREE.FrontSide });
  scene.add(new THREE.Mesh(atmosGeo, atmosMat));

  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(1800 * 3);
  for (let i = 0; i < 1800 * 3; i++) starPos[i] = (Math.random() - 0.5) * 300;
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.18, sizeAttenuation: true }));
  scene.add(stars);

  canvas.classList.add('ready');
  if (pin) pin.classList.add('visible');

  // 2. CONFIGURACIÓN ÚNICA (MÓVIL VS PC)
  const isMobile = window.innerWidth < 768;

  const tl = gsap.timeline({ delay: 0.3 });

  // Giro del Globo
  tl.to(globeGroup.rotation, {
    y: isMobile ? -0.15 : -0.65,
    x: 0.05,
    duration: 6,
    ease: 'power2.inOut'
  }, 0);

  // Encuadre de la Cámara
  tl.to(camera.position, {
    x: isMobile ? 0 : -0.75,
    y: isMobile ? 0 : 0.05,
    z: isMobile ? 1.9 : 2.0,
    duration: 6,
    ease: 'power2.inOut'
  }, 0);

  tl.to('.hero-eyebrow', { opacity: 1, y: 0, duration: .6, ease: 'power2.out' }, 4.0);
  tl.to('.hero-title', { opacity: 1, y: 0, duration: .7, ease: 'power2.out' }, 4.25);
  tl.to('.hero-sub', { opacity: 1, y: 0, duration: .6, ease: 'power2.out' }, 4.6);
  tl.to('.hero-cta', { opacity: 1, y: 0, duration: .5, ease: 'power2.out' }, 4.9);
  tl.to('.hero-badges', { opacity: 1, y: 0, duration: .5, ease: 'power2.out' }, 5.1);
  gsap.set(['.hero-eyebrow', '.hero-title', '.hero-sub', '.hero-cta', '.hero-badges'], { y: 24 });

  // 3. RENDER LOOP DIRECTO
  const ubatePosition = latLonToVector3(UBATE_LAT, UBATE_LON, radius);

  function animate() {
    requestAnimationFrame(animate);
    const time = Date.now() * 0.001;
    globe.position.y = Math.sin(time * 1.5) * 0.02;
    globe.rotation.y = Math.sin(time * 0.8) * 0.015;
    stars.rotation.y += 0.00005;

    renderer.render(scene, camera);

    if (pin) {
      const worldPos = ubatePosition.clone().applyMatrix4(globe.matrixWorld);
      const vector = worldPos.clone().project(camera);

      // Coordenadas absolutas basadas en la ventana
      const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
      const y = (-(vector.y * 0.5) + 0.5) * window.innerHeight;

      const dirToCamera = camera.position.clone().sub(worldPos).normalize();
      const dot = dirToCamera.dot(worldPos.clone().normalize());

      pin.style.opacity = (dot > 0.1) ? '1' : '0';
      pin.style.transform = `translate(-50%, -50%)`;
      pin.style.left = `${x}px`;
      pin.style.top = `${y}px`;
    }
  }
  animate();

  // 4. RESIZE SIN ANIMACIONES CRUZADAS (Como lo pediste)
  window.addEventListener('resize', () => {
    const mobile = window.innerWidth < 768;

    // Actualiza tamaño real
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Posiciona directamente sin animaciones que causen bugs
    camera.position.set(
      mobile ? 0 : -0.75,
      mobile ? 0 : 0.05,
      mobile ? 1.9 : 2.0
    );
    globeGroup.rotation.y = mobile ? -0.15 : -0.65;
  });
}