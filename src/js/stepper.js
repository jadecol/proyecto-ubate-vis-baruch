const SMMLV = 1423500

const PROFILES = [
  { value: 'empleado_oficial',     label: '🏛️ Empleado oficial',              caja: true,  badge: 'badge-caja',     badgeText: 'Acceso a Caja',         desc: 'Trabajo en entidad del Estado o empresa pública' },
  { value: 'empleado_privado',     label: '🏢 Empleado privado',              caja: true,  badge: 'badge-caja',     badgeText: 'Acceso a Caja',         desc: 'Contrato con empresa, cotizo a caja de compensación' },
  { value: 'independiente_rut',    label: '📄 Independiente con RUT',         caja: false, badge: 'badge-standard', badgeText: 'Subsidio Fonvivienda',   desc: 'Trabajo por cuenta propia, declaro renta o facturo' },
  { value: 'vendedor_comerciante', label: '🛒 Vendedor / Comerciante',        caja: false, badge: 'badge-standard', badgeText: 'Subsidio Fonvivienda',   desc: 'Negocio propio o ventas informales' },
  { value: 'madre_cabeza',         label: '👩‍👧 Madre/Padre cabeza de familia', caja: false, badge: 'badge-subsidy',  badgeText: 'Subsidio prioritario',  desc: 'Jefe de hogar con hijos a cargo, sin pareja' },
  { value: 'pensionado',           label: '👴 Pensionado',                    caja: false, badge: 'badge-standard', badgeText: 'Subsidio Fonvivienda',   desc: 'Recibo mesada pensional mensualmente' },
]

const RENT_OPTIONS = [
  { value: 'menos_500',  score: 'A',  label: 'Menos de $500.000 / mes',        desc: 'Arriendo bajo — su cuota de vivienda sería similar o menor',                          tagCls: 'rent-tag-green', tagText: '✓ Perfil viable' },
  { value: '500_900',    score: 'A+', label: 'Entre $500.000 y $900.000 / mes', desc: 'Rango ideal — equivale exactamente a la cuota de su propia vivienda en Ubaté',       tagCls: 'rent-tag-teal',  tagText: '⭐ Perfil prioritario' },
  { value: 'mas_900',    score: 'B',  label: 'Más de $900.000 / mes',           desc: 'Paga más de arriendo de lo que costaría su propia casa — ¡ya puede ser propietario!', tagCls: 'rent-tag-blue',  tagText: '💡 Le conviene comprar ya' },
  { value: 'no_paga',    score: 'C',  label: 'No pago arriendo',                desc: 'Vive con familia o en vivienda propia parcialmente. Igualmente puede calificar.',     tagCls: 'rent-tag-gray',  tagText: '→ Evaluamos su caso' },
]

const RENT_MESSAGES = {
  menos_500: { cls: 'rent-msg-green', icon: '✅', title: '¡Excelente! Su perfil es viable',                    text: 'La cuota mensual de su lote en Ubaté puede ser similar a lo que paga hoy de arriendo — pero construyendo <strong>su propio patrimonio</strong>.' },
  '500_900': { cls: 'rent-msg-teal',  icon: '⭐', title: '¡Perfil prioritario! Usted ya puede ser propietario', text: 'Lo que paga de arriendo es <strong>exactamente lo que costaría su cuota en Ubaté</strong>. Tenemos unidades diseñadas para su rango.' },
  mas_900:   { cls: 'rent-msg-blue',  icon: '💡', title: '¡Definitivamente debería comprar ya!',               text: 'Paga <strong>más de arriendo</strong> que de cuota propia. Cada mes que pasa pierde dinero. Con subsidio puede dar el paso ahora.' },
  no_paga:   { cls: 'rent-msg-gray',  icon: '🏠', title: 'Igualmente puede calificar',                         text: 'No pagar arriendo es una ventaja: tiene más ahorro mensual. Evaluaremos su caso individualmente.' },
}

function fmt(n) {
  return '$' + Math.round(n).toLocaleString('es-CO')
}

// ── STATE
let currentStep     = 1
let selectedProfile = null
let selectedRent    = null

// ── HELPERS
function dot(n)  { return document.getElementById('dot'  + n) }
function line(n) { return document.getElementById('line' + n) }
function lbl(n)  { return document.getElementById('lbl'  + n) }
function panel(n){ return document.getElementById('step' + n) }

function goStep(n) {
  // Deactivate current
  panel(currentStep).classList.remove('active')
  dot(currentStep).classList.remove('active')
  dot(currentStep).classList.add('done')
  dot(currentStep).textContent = '✓'

  // Mark / unmark lines
  for (let i = 1; i <= 4; i++) {
    const l = line(i)
    if (l) l.classList.toggle('done', i < n)
  }
  // Revert dots if going back
  for (let i = n; i <= 4; i++) {
    if (i !== currentStep) {
      dot(i).classList.remove('done')
      if (!dot(i).classList.contains('active')) dot(i).textContent = i
    }
  }

  currentStep = n
  panel(n).classList.add('active')
  dot(n).classList.remove('done')
  dot(n).classList.add('active')
  dot(n).textContent = n

  // Update labels
  for (let i = 1; i <= 4; i++) {
    const el = lbl(i)
    if (!el) continue
    el.classList.remove('active', 'done')
    if (i < n)  el.classList.add('done')
    if (i === n) el.classList.add('active')
  }

  // Populate chips
  const pLabel = PROFILES.find(p => p.value === selectedProfile)?.label || ''
  if (n === 2) document.getElementById('profileChip2').textContent = pLabel
  if (n === 3) {
    document.getElementById('profileChip3').textContent = pLabel
    updateCalc()
  }
  if (n === 4) document.getElementById('profileChip4').textContent = pLabel

  document.getElementById('registro').scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function buildProfiles() {
  const grid = document.getElementById('profileGrid')
  if (!grid) return
  grid.innerHTML = PROFILES.map(p => `
    <div class="profile-card" data-value="${p.value}" data-caja="${p.caja}">
      <div class="profile-icon">${p.label.split(' ')[0]}</div>
      <div class="profile-name">${p.label.replace(/^\S+\s/, '')}</div>
      <div class="profile-desc">${p.desc}</div>
      <span class="profile-badge ${p.badge}">${p.badgeText}</span>
    </div>`).join('')

  grid.querySelectorAll('.profile-card').forEach(card => {
    card.addEventListener('click', () => {
      grid.querySelectorAll('.profile-card').forEach(c => c.classList.remove('selected'))
      card.classList.add('selected')
      selectedProfile = card.dataset.value
      document.getElementById('btnNext1').disabled = false
      document.getElementById('hPerfil').value = selectedProfile
      const hasCaja = card.dataset.caja === 'true'
      document.getElementById('selCaja').value = hasCaja ? 'si' : 'no'
    })
  })
}

function buildRentOptions() {
  const wrap = document.getElementById('rentOptions')
  if (!wrap) return
  wrap.innerHTML = RENT_OPTIONS.map(r => `
    <div class="rent-card" data-value="${r.value}" data-score="${r.score}" data-label="${r.label}">
      <div class="rent-range">${r.label}</div>
      <div class="rent-desc">${r.desc}</div>
      <span class="rent-tag ${r.tagCls}">${r.tagText}</span>
    </div>`).join('')

  wrap.querySelectorAll('.rent-card').forEach(card => {
    card.addEventListener('click', () => {
      wrap.querySelectorAll('.rent-card').forEach(c => c.classList.remove('selected'))
      card.classList.add('selected')
      selectedRent = card.dataset.value
      document.getElementById('btnNext2').disabled = false
      document.getElementById('hArriendo').value      = card.dataset.label
      document.getElementById('hScoreArriendo').value = card.dataset.score

      const msg = RENT_MESSAGES[selectedRent]
      const box = document.getElementById('rentMessage')
      box.style.display = 'block'
      box.className     = `rent-message ${msg.cls}`
      box.innerHTML     = `<div class="rent-msg-icon">${msg.icon}</div>
        <div class="rent-msg-title">${msg.title}</div>
        <div>${msg.text}</div>`
    })
  })
}

function updateCalc() {
  const ingresos = parseInt(document.getElementById('rangeIngresos').value)
  const ahorro   = parseInt(document.getElementById('rangeAhorro').value)
  const caja     = document.getElementById('selCaja').value === 'si'

  document.getElementById('lblIngresos').textContent = fmt(ingresos)
  document.getElementById('lblAhorro').textContent   = fmt(ahorro)
  document.getElementById('hIngresos').value = fmt(ingresos)
  document.getElementById('hAhorro').value   = fmt(ahorro)
  document.getElementById('hCaja').value     = caja ? 'Sí' : 'No'

  const smmlvs      = ingresos / SMMLV
  const esPrioridad = selectedProfile === 'madre_cabeza'
  let subsidio = 0, titulo = '', tip = '', color = ''

  if (smmlvs <= 2) {
    subsidio = caja ? 52000000 : 38000000
    if (esPrioridad) subsidio = Math.min(subsidio + 5000000, 52000000)
    titulo = '✅ ¡Muy probablemente calificas al subsidio!'; color = 'eligible'
    tip = `Con ${fmt(ingresos)} (${smmlvs.toFixed(1)} SMMLV) estás en rango prioritario. ${caja ? 'Con Caja accedes al subsidio más alto.' : 'Sin caja, aplicas directo a Fonvivienda.'} ${esPrioridad ? 'Como cabeza de familia tienes puntaje adicional.' : ''}`
  } else if (smmlvs <= 4) {
    subsidio = caja ? 46000000 : 28000000
    titulo = '✅ Calificas al subsidio de vivienda'; color = 'eligible'
    tip = `Con ${smmlvs.toFixed(1)} SMMLV estás en rango VIS. ${caja ? 'Tu caja te da el subsidio más completo.' : 'Puedes aplicar a Mi Casa Ya (Fonvivienda).'}`
  } else if (smmlvs <= 8) {
    subsidio = caja ? 22000000 : 12000000
    titulo = '⚠️ Calificas a subsidio parcial'; color = 'maybe'
    tip = `Con ${smmlvs.toFixed(1)} SMMLV puedes aplicar a subsidio menor. Los lotes son la mejor opción.`
  } else {
    subsidio = 0; titulo = '📊 Tu perfil es para crédito hipotecario'; color = 'ineligible'
    tip = `Con ${fmt(ingresos)} superas el límite VIS. Tienes buena capacidad para financiación bancaria directa.`
  }

  const cuotaEst = Math.round(ingresos * 0.30)
  const credito  = Math.round(cuotaEst * 120)

  const box = document.getElementById('resultBox')
  box.className = `result-box show ${color}`
  document.getElementById('resultTitle').textContent = titulo
  document.getElementById('resultGrid').innerHTML = `
    <div class="result-stat"><div class="result-stat-val">${fmt(subsidio)}</div><div class="result-stat-label">Subsidio estimado</div></div>
    <div class="result-stat"><div class="result-stat-val">${fmt(cuotaEst)}</div><div class="result-stat-label">Cuota mensual aprox.</div></div>
    <div class="result-stat"><div class="result-stat-val">${fmt(credito)}</div><div class="result-stat-label">Crédito estimado</div></div>`
  document.getElementById('resultTip').textContent = tip

  let opts = '<strong style="font-size:.8rem;color:#374151;display:block;margin-bottom:6px;">Opciones recomendadas:</strong>'
  if (subsidio >= 40000000)  opts += '<span class="result-option-tag green">Apartamento 72 m² + Subsidio</span>'
  else if (subsidio > 0)     opts += '<span class="result-option-tag">Lote 96 m²</span><span class="result-option-tag">Lote 81.5 m²</span>'
  else                        opts += '<span class="result-option-tag">Lote 81.5 m²</span><span class="result-option-tag">Lote 96 m²</span>'
  document.getElementById('resultOptions').innerHTML = opts
  document.getElementById('hResultado').value = `Subsidio: ${fmt(subsidio)} | Cuota: ${fmt(cuotaEst)}`

  const radios = document.querySelectorAll('input[name="opcion"]')
  if (subsidio >= 40000000) radios[2].checked = true
  else if (subsidio > 0)    radios[1].checked = true
  else                       radios[0].checked = true
}

export function initStepper() {
  buildProfiles()
  buildRentOptions()

  // Nav buttons
  document.getElementById('btnNext1')?.addEventListener('click', () => goStep(2))
  document.getElementById('backBtn2')?.addEventListener('click', () => goStep(1))
  document.getElementById('btnNext2')?.addEventListener('click', () => goStep(3))
  document.getElementById('backBtn3')?.addEventListener('click', () => goStep(2))
  document.getElementById('btnNext3')?.addEventListener('click', () => goStep(4))
  document.getElementById('backBtn4')?.addEventListener('click', () => goStep(3))

  // Calc sliders
  document.getElementById('rangeIngresos')?.addEventListener('input', updateCalc)
  document.getElementById('rangeAhorro')?.addEventListener('input', updateCalc)
  document.getElementById('selPersonas')?.addEventListener('change', updateCalc)
  document.getElementById('selCaja')?.addEventListener('change', updateCalc)

  updateCalc()
}
