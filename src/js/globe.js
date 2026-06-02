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
  camera.position.set(0, 0, 6);

  // ── LIGHTS
  const ambientLight = new THREE.AmbientLight(0xffffff, 2.5); // Subimos de 1.2 a 2.5 para más claridad general
  scene.add(ambientLight);

  const sun = new THREE.DirectionalLight(0xffffff, 5.0); // Subimos de 3.0 a 5.0 para que el continente resalte
  sun.position.set(5, 3, 5);
  scene.add(sun);

  const rimLight = new THREE.DirectionalLight(0x28C4B0, 0.8); // Toque extra de brillo verde/teal en el borde
  rimLight.position.set(-5, -2, -3);
  scene.add(rimLight);

  // ── GLOBE (Textura local de alta resolución)
  const radius = 1;
  // 1. Doblamos la cantidad de polígonos para una esfera perfecta
  const globeGeometry = new THREE.SphereGeometry(radius, 128, 128);

  const textureLoader = new THREE.TextureLoader();

  // 2. Cargamos la imagen desde tu carpeta local 'public'
  // (Si aún no la descargas, puedes dejar temporalmente la URL de unpkg aquí)
  const earthTexture = textureLoader.load('/earth-blue-marble.jpg');
  earthTexture.colorSpace = THREE.SRGBColorSpace;

  // 3. EL SECRETO DE LA NITIDEZ: Filtro Anisotrópico al máximo soportado por la tarjeta gráfica
  earthTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  earthTexture.generateMipmaps = true;
  earthTexture.minFilter = THREE.LinearMipmapLinearFilter;

  const globeMaterial = new THREE.MeshStandardMaterial({
    map: earthTexture,
    roughness: 0.6,
    metalness: 0.1
  });

  const globe = new THREE.Mesh(globeGeometry, globeMaterial);

  // Calculate Ubaté position
  const ubatePosition = latLonToVector3(UBATE_LAT, UBATE_LON, radius);

  // ── GROUPS
  const globeGroup = new THREE.Group();
  scene.add(globeGroup);
  globeGroup.add(globe);

  // Offset inicial del grupo
  globeGroup.rotation.y = -Math.PI * 0.8;
  globeGroup.rotation.x = 0.2;

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
  const isMobile = window.innerWidth < 768;

  // Gira hasta Colombia
  tl.to(globeGroup.rotation, {
    y: -0.65, // Cambiamos -1.5 por -0.7 para traer a Colombia hacia el centro-derecha
    x: 0.1,
    duration: 6,
    ease: 'power2.inOut'
  }, 0);

  // Cámara: Zoom majestuoso y encuadre a la derecha
  tl.to(camera.position, {
    x: isMobile ? 0 : -0.55,
    z: isMobile ? 1.9 : 1.4, // Nos alejamos un poco (de 1.15 a 1.4) para no perdernos y ver el país
    duration: 6, // Sincronizado a 6 segundos
    ease: 'power2.inOut'
  }, 0);

  // Animate hero text in
  tl.to('.hero-eyebrow', { opacity: 1, y: 0, duration: .6, ease: 'power2.out' }, 4.0);
  tl.to('.hero-title', { opacity: 1, y: 0, duration: .7, ease: 'power2.out' }, 4.25);
  tl.to('.hero-sub', { opacity: 1, y: 0, duration: .6, ease: 'power2.out' }, 4.6);
  tl.to('.hero-cta', { opacity: 1, y: 0, duration: .5, ease: 'power2.out' }, 4.9);
  tl.to('.hero-badges', { opacity: 1, y: 0, duration: .5, ease: 'power2.out' }, 5.1);

  gsap.set(['.hero-eyebrow', '.hero-title', '.hero-sub', '.hero-cta', '.hero-badges'], { y: 24 });

  // ── RENDER LOOP & PIN TRACKING
  let animId;
  function animate() {
    animId = requestAnimationFrame(animate);

    const time = Date.now() * 0.001;
    // EL TRUCO: Aplicamos la respiración a la malla interna ('globe'), no al grupo externo que usa GSAP
    globe.position.y = Math.sin(time * 1.5) * 0.04;
    globe.rotation.y = Math.sin(time * 0.8) * 0.03;

    stars.rotation.y += 0.00005;

    renderer.render(scene, camera);

    // Update CSS Pin Position
    if (pin) {
      const worldPos = ubatePosition.clone().applyMatrix4(globe.matrixWorld);
      const dirToCamera = camera.position.clone().sub(worldPos).normalize();
      const normal = worldPos.clone().normalize();
      const dot = dirToCamera.dot(normal);

      if (dot < 0) {
        pin.style.opacity = '0';
      } else {
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

  window.addEventListener('resize', () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else animate();
  });
}