import * as THREE from 'three'
import gsap from 'gsap'

// Ubaté coordinates → spherical position on globe
const UBATE_LAT =  5.3128   // degrees N
const UBATE_LON = -73.8171  // degrees W

function latLonToVec3(lat, lon, radius) {
  const phi   = (90 - lat)  * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
     radius * Math.cos(phi),
     radius * Math.sin(phi) * Math.sin(theta)
  )
}

export function initGlobe() {
  const canvas = document.getElementById('globeCanvas')
  if (!canvas) return

  // ── RENDERER
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(canvas.clientWidth, canvas.clientHeight)
  renderer.setClearColor(0x000000, 0)

  // ── SCENE
  const scene  = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000)
  camera.position.set(0, 0, 4.5) // start far — "from space"

  // ── LIGHTS
  const ambient = new THREE.AmbientLight(0xffffff, 0.4)
  scene.add(ambient)
  const sun = new THREE.DirectionalLight(0x6699ff, 1.8)
  sun.position.set(5, 3, 5)
  scene.add(sun)
  const rimLight = new THREE.DirectionalLight(0x28C4B0, 0.6)
  rimLight.position.set(-5, -2, -3)
  scene.add(rimLight)

  // ── GLOBE (procedural texture — no external image needed)
  const globeGeo = new THREE.SphereGeometry(1, 64, 64)

  // Build a canvas texture for the globe surface
  const texCanvas  = document.createElement('canvas')
  texCanvas.width  = 2048
  texCanvas.height = 1024
  const ctx = texCanvas.getContext('2d')

  // Ocean base
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, 1024)
  oceanGrad.addColorStop(0,   '#0a2a4a')
  oceanGrad.addColorStop(0.5, '#0d3b6e')
  oceanGrad.addColorStop(1,   '#0a2a4a')
  ctx.fillStyle = oceanGrad
  ctx.fillRect(0, 0, 2048, 1024)

  // Draw simplified continental shapes (paths from lon/lat → canvas pixels)
  function project(lon, lat) {
    return [(lon + 180) / 360 * 2048, (90 - lat) / 180 * 1024]
  }

  ctx.fillStyle = '#1a4a28'
  ctx.strokeStyle = '#2a6a3a'
  ctx.lineWidth = 1

  // South America
  ctx.beginPath()
  const sa = [
    [-80,12],[-75,11],[-62,11],[-60,5],[-50,5],[-35,5],[-35,-5],[-37,-10],
    [-39,-15],[-40,-20],[-42,-23],[-44,-23],[-45,-28],[-50,-30],[-52,-33],
    [-55,-35],[-58,-38],[-62,-41],[-65,-45],[-66,-50],[-68,-55],[-70,-55],
    [-75,-50],[-75,-45],[-72,-40],[-72,-33],[-75,-28],[-80,-20],[-80,-15],
    [-78,-5],[-78,5],[-80,12]
  ]
  sa.forEach(([lon, lat], i) => {
    const [x, y] = project(lon, lat)
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  })
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // North America (simplified)
  ctx.beginPath()
  const na = [
    [-170,72],[-140,72],[-110,72],[-80,72],[-70,68],[-60,64],[-55,58],
    [-58,47],[-65,43],[-70,42],[-73,40],[-80,38],[-80,25],[-87,20],[-90,17],
    [-88,15],[-83,10],[-78,8],[-75,10],[-72,12],[-65,18],[-60,16],[-58,8],
    [-62,10],[-70,22],[-75,23],[-80,25],[-82,28],[-87,30],[-90,29],[-95,28],
    [-100,26],[-105,20],[-110,22],[-117,30],[-120,34],[-124,38],[-124,48],
    [-130,54],[-140,58],[-150,60],[-160,64],[-170,66],[-170,72]
  ]
  na.forEach(([lon, lat], i) => {
    const [x, y] = project(lon, lat)
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  })
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // Europe + Africa (simplified blob)
  ctx.beginPath()
  const eaf = [
    [-20,60],[0,65],[30,68],[40,62],[50,55],[40,45],[30,42],[28,35],[32,30],
    [36,22],[42,12],[50,10],[50,-5],[40,-10],[35,-20],[30,-30],[25,-35],[20,-38],
    [15,-35],[10,-30],[5,-35],[0,-35],[-5,-30],[-10,-22],[-15,-15],[-18,-5],
    [-18,5],[-15,15],[-18,20],[-20,28],[-17,35],[-10,40],[-10,45],[-5,50],
    [-10,55],[-15,58],[-20,60]
  ]
  eaf.forEach(([lon, lat], i) => {
    const [x, y] = project(lon, lat)
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  })
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // Asia (simplified)
  ctx.beginPath()
  const as = [
    [40,70],[60,72],[80,72],[100,72],[120,70],[140,68],[160,62],[180,65],
    [180,50],[160,50],[140,42],[130,35],[120,25],[115,20],[105,10],[100,2],
    [104,-5],[108,-8],[115,-10],[120,-5],[120,5],[115,10],[110,20],[100,22],
    [90,22],[80,28],[70,30],[60,28],[50,22],[45,15],[42,12],[40,20],[38,30],
    [38,38],[40,45],[40,55],[40,65],[40,70]
  ]
  as.forEach(([lon, lat], i) => {
    const [x, y] = project(lon, lat)
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  })
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // Australia
  ctx.beginPath()
  const au = [
    [114,-22],[120,-18],[128,-14],[136,-12],[140,-15],[148,-18],[152,-24],
    [154,-28],[152,-34],[148,-38],[144,-38],[140,-36],[136,-34],[130,-34],
    [126,-34],[122,-34],[114,-30],[114,-22]
  ]
  au.forEach(([lon, lat], i) => {
    const [x, y] = project(lon, lat)
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  })
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // Colombia highlight
  ctx.fillStyle   = '#2a7a3a'
  ctx.strokeStyle = '#4aaa5a'
  ctx.lineWidth   = 1.5
  ctx.beginPath()
  const col = [
    [-77,8],[-75,11],[-72,12],[-67,12],[-65,5],[-67,2],[-67,-2],[-72,-4],
    [-75,-2],[-77,2],[-78,5],[-78,8],[-77,8]
  ]
  col.forEach(([lon, lat], i) => {
    const [x, y] = project(lon, lat)
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  })
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // Ubaté dot
  const [ux, uy] = project(UBATE_LON, UBATE_LAT)
  const pulse = ctx.createRadialGradient(ux, uy, 0, ux, uy, 14)
  pulse.addColorStop(0,   'rgba(40,196,176,0.9)')
  pulse.addColorStop(0.4, 'rgba(40,196,176,0.5)')
  pulse.addColorStop(1,   'rgba(40,196,176,0)')
  ctx.fillStyle = pulse
  ctx.beginPath()
  ctx.arc(ux, uy, 14, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#28C4B0'
  ctx.beginPath()
  ctx.arc(ux, uy, 5, 0, Math.PI * 2)
  ctx.fill()

  // Atmospheric glow ring
  ctx.strokeStyle = 'rgba(68,150,255,0.08)'
  ctx.lineWidth   = 24
  ctx.beginPath()
  ctx.arc(1024, 512, 490, 0, Math.PI * 2)
  ctx.stroke()

  const globeTex  = new THREE.CanvasTexture(texCanvas)
  const globeMat  = new THREE.MeshPhongMaterial({
    map:        globeTex,
    specular:   new THREE.Color(0x2244aa),
    shininess:  18,
    transparent: false,
  })
  const globe = new THREE.Mesh(globeGeo, globeMat)
  scene.add(globe)

  // ── ATMOSPHERE
  const atmosGeo = new THREE.SphereGeometry(1.04, 64, 64)
  const atmosMat = new THREE.MeshPhongMaterial({
    color:       0x4488ff,
    transparent: true,
    opacity:     0.08,
    side:        THREE.FrontSide,
  })
  scene.add(new THREE.Mesh(atmosGeo, atmosMat))

  // ── STARS
  const starGeo = new THREE.BufferGeometry()
  const starCount = 1800
  const starPos   = new Float32Array(starCount * 3)
  for (let i = 0; i < starCount * 3; i++) starPos[i] = (Math.random() - 0.5) * 300
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
  const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.18, sizeAttenuation: true })
  const stars   = new THREE.Points(starGeo, starMat)
  scene.add(stars)

  // ── ORIENT globe so Colombia faces camera
  // Colombia is roughly at lon -73, lat 5 — rotate globe to put that facing Z+
  const targetPos = latLonToVec3(UBATE_LAT, UBATE_LON, 1)
  const targetQuat = new THREE.Quaternion()
  targetQuat.setFromUnitVectors(new THREE.Vector3(0, 0, 1), targetPos.normalize())
  globe.quaternion.copy(targetQuat)

  // ── GSAP ANIMATION SEQUENCE
  // Phase 1 (0–2.5s): camera far, globe small, rotate slowly
  // Phase 2 (2.5–5s): camera zooms in toward globe
  // Phase 3 (5–6.5s): zoom continues to Colombia region
  // Phase 4 (6.5s+): hero text animates in, globe stays as bg

  canvas.classList.add('ready')

  const tl = gsap.timeline({ delay: 0.3 })

  // Slow rotation during approach
  tl.to(globe.rotation, {
    y: Math.PI * 0.15,
    duration: 5,
    ease: 'power1.inOut'
  }, 0)

  // Camera zoom: far → medium
  tl.to(camera.position, {
    z: 2.8,
    duration: 2.8,
    ease: 'power2.in'
  }, 0.5)

  // Camera zoom: medium → close
  tl.to(camera.position, {
    z: 1.85,
    duration: 2,
    ease: 'power3.inOut'
  }, 3)

  // Final zoom to hover above Colombia
  tl.to(camera.position, {
    z: 1.52,
    duration: 1.5,
    ease: 'power2.out'
  }, 4.8)

  // After zoom, slight tilt
  tl.to(camera.position, {
    y: 0.12,
    x: 0.04,
    duration: 1.2,
    ease: 'power1.inOut'
  }, 5.5)

  // Animate hero text in
  tl.to('.hero-eyebrow', { opacity: 1, y: 0, duration: .6, ease: 'power2.out' }, 5.0)
  tl.to('.hero-title',   { opacity: 1, y: 0, duration: .7, ease: 'power2.out' }, 5.25)
  tl.to('.hero-sub',     { opacity: 1, y: 0, duration: .6, ease: 'power2.out' }, 5.6)
  tl.to('.hero-cta',     { opacity: 1, y: 0, duration: .5, ease: 'power2.out' }, 5.9)
  tl.to('.hero-badges',  { opacity: 1, y: 0, duration: .5, ease: 'power2.out' }, 6.1)

  // Set initial GSAP state for text elements
  gsap.set(['.hero-eyebrow','.hero-title','.hero-sub','.hero-cta','.hero-badges'], {
    y: 24
  })

  // ── RENDER LOOP
  let animId
  function animate() {
    animId = requestAnimationFrame(animate)
    globe.rotation.y += 0.0008   // very slow idle spin
    stars.rotation.y += 0.00005
    renderer.render(scene, camera)
  }
  animate()

  // ── RESIZE
  window.addEventListener('resize', () => {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  })

  // ── PAUSE on page hidden (save battery)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animId)
    else animate()
  })
}
