const TIPS = [
  { icon: '🐷', cat: 'Ahorro', title: 'La regla del 10%', text: 'Destina al menos el 10% de tu ingreso mensual exclusivamente para el ahorro de vivienda. Automatízalo el día de pago.' },
  { icon: '📋', cat: 'Subsidio', title: 'Inscríbete en el SISBEN', text: 'El puntaje SISBEN es requisito para acceder a subsidios del Gobierno. Actualízalo si tu situación cambió.' },
  { icon: '🏦', cat: 'Crédito', title: 'Cuida tu historial', text: 'Paga a tiempo tus deudas actuales. Un buen historial en DataCrédito te abre las puertas al crédito hipotecario.' },
  { icon: '💡', cat: 'Subsidio VIS', title: 'Mi Casa Ya', text: 'El programa Mi Casa Ya cubre hasta 30 cuotas de tu crédito si ganas menos de 4 SMMLV. ¡Aplica sin intermediarios!' },
  { icon: '📂', cat: 'Documentos', title: 'Alista tu carpeta', text: 'Ten listos: cédula, certificado laboral, últimos 3 desprendibles de pago y extractos bancarios de 3 meses.' },
  { icon: '🤝', cat: 'Caja de Compensación', title: 'Subsidio por Caja', text: 'Si estás afiliado a Compensar, Colsubsidio o similar, tienes acceso a subsidio adicional de hasta $52M.' },
  { icon: '📊', cat: 'Finanzas', title: 'La cuota no debe superar el 30%', text: 'El banco aprueba créditos cuando la cuota es máximo el 30% de tus ingresos. Planea con esa cifra.' },
  { icon: '🌱', cat: 'Ahorro', title: 'Cuenta AFC', text: 'Las cuentas AFC te permiten ahorrar sin pagar retención en la fuente sobre ese dinero.' },
  { icon: '🏡', cat: 'Compra', title: 'Visita en persona', text: 'Antes de firmar, visita el lote o apartamento dos veces en días distintos para ver el entorno real.' },
  { icon: '⚖️', cat: 'Legal', title: 'Verifica la escritura', text: 'Comprueba que el predio tiene matrícula inmobiliaria limpia y libre de embargos en la Superintendencia de Notariado.' },
  { icon: '🔑', cat: 'Subsidio', title: 'Fonvivienda directo', text: 'Si eres independiente o informal, puedes aplicar a subsidio nacional en fonvivienda.gov.co sin necesidad de caja.' },
  { icon: '💰', cat: 'Ahorro', title: 'Cuota inicial mínima', text: 'Generalmente necesitas el 20-30% del valor de la propiedad como cuota inicial. Calcula tu meta y fija una fecha.' },
]

function buildCard(tip) {
  return `
    <div class="tip-card">
      <div class="tip-icon">${tip.icon}</div>
      <div class="tip-category">${tip.cat}</div>
      <div class="tip-title">${tip.title}</div>
      <div class="tip-text">${tip.text}</div>
    </div>`
}

export function initTips() {
  const track = document.getElementById('tipsTrack')
  if (!track) return

  // Triple for seamless loop
  track.innerHTML = [...TIPS, ...TIPS, ...TIPS].map(buildCard).join('')

  const wrap   = track.parentElement
  const SPEED  = 0.5   // px per frame
  let offset   = 0
  let isPaused = false
  let lastTime = null

  function getSetWidth() {
    return track.scrollWidth / 3
  }

  function step(ts) {
    if (!lastTime) lastTime = ts
    const delta = ts - lastTime
    lastTime = ts

    if (!isPaused) {
      offset += SPEED * (delta / 16.67)
      const setW = getSetWidth()
      if (offset >= setW) offset -= setW
      track.style.transform = `translateX(-${offset}px)`
    }
    requestAnimationFrame(step)
  }
  requestAnimationFrame(step)

  // Pause on hover / touch
  wrap.addEventListener('mouseenter', () => { isPaused = true })
  wrap.addEventListener('mouseleave', () => { isPaused = false; lastTime = null })
  wrap.addEventListener('touchstart', () => { isPaused = true },  { passive: true })
  wrap.addEventListener('touchend',   () => { isPaused = false; lastTime = null }, { passive: true })
}
