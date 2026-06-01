const TITLES = {
  politica:     'Política de Privacidad',
  datos:        'Tratamiento de Datos Personales',
  autorizacion: 'Autorización para Comunicaciones',
  terminos:     'Términos y Condiciones de Uso',
}

const CONTENT = {
  politica: `
    <p class="legal-date">Última actualización: mayo de 2025</p>
    <div class="highlight-box">Jadecol se compromete a proteger la privacidad de sus datos personales en cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013.</div>
    <h4>1. Responsable del tratamiento</h4>
    <p><strong>Jadecol</strong>, empresa colombiana. Contacto: <em>info@jadecol.com</em> · WhatsApp: <em>+57 311 262 1281</em></p>
    <h4>2. Datos que recolectamos</h4>
    <ul><li>Nombre completo</li><li>Número de celular o teléfono</li><li>Información económica voluntaria (ingresos, ahorro)</li><li>Perfil laboral seleccionado</li><li>Preferencia de producto habitacional</li><li>Rango de arriendo actual</li></ul>
    <h4>3. Finalidad del tratamiento</h4>
    <ul><li>Realizar el estudio de mercado del proyecto habitacional en Ubaté</li><li>Brindar asesoría personalizada sobre subsidios y opciones de vivienda</li><li>Contactar al titular para informarle sobre el desarrollo del proyecto</li><li>Enviar información comercial cuando el titular lo autorice expresamente</li></ul>
    <h4>4. Derechos del titular</h4>
    <p>En cualquier momento puede: conocer, actualizar, rectificar o suprimir sus datos; revocar la autorización; presentar quejas ante la Superintendencia de Industria y Comercio.</p>
    <h4>5. Canales de atención</h4>
    <p>Escriba a <em>info@jadecol.com</em> con asunto "Datos Personales". Respuesta en 15 días hábiles.</p>
    <h4>6. Transferencia de datos</h4>
    <p>Sus datos no serán vendidos ni cedidos a terceros sin consentimiento expreso, salvo obligación legal.</p>
    <h4>7. Seguridad</h4>
    <p>Implementamos medidas técnicas y administrativas para proteger sus datos. Los datos económicos de la calculadora son orientativos y no se almacenan en nuestros servidores.</p>`,

  datos: `
    <p class="legal-date">Vigente desde: enero de 2025 · Basado en Ley 1581 de 2012</p>
    <div class="highlight-box">Al diligenciar y enviar el formulario, usted otorga su consentimiento libre, previo, expreso e informado para el tratamiento de sus datos personales.</div>
    <h4>1. Base legal del tratamiento</h4>
    <p>Consentimiento del titular (Art. 6, Ley 1581 de 2012) para finalidades relacionadas con el estudio de demanda habitacional y asesoría en vivienda de interés social.</p>
    <h4>2. Datos sensibles</h4>
    <p>Este formulario <strong>no recolecta datos sensibles</strong>. La información económica es voluntaria y de uso estadístico-orientativo.</p>
    <h4>3. Tiempo de conservación</h4>
    <p>Sus datos serán conservados por máximo <strong>2 años</strong> desde la recolección, o hasta que solicite su eliminación.</p>
    <h4>4. Encargados del tratamiento</h4>
    <p>Se utiliza la plataforma <strong>Formspree</strong> para gestión del formulario. Jadecol garantiza que todo encargado ofrece niveles equivalentes de protección.</p>
    <h4>5. Procedimiento para revocar autorización</h4>
    <ul><li>Envíe un correo a <em>info@jadecol.com</em> con asunto "Revocación de autorización"</li><li>Incluya su nombre completo y número de celular registrado</li><li>Recibirá confirmación de eliminación dentro de los 15 días hábiles siguientes</li></ul>
    <h4>6. Uso de cookies</h4>
    <p>Este sitio puede utilizar herramientas de analítica web de terceros para medir el desempeño de la campaña de forma anónima y agregada.</p>
    <h4>7. Menores de edad</h4>
    <p>Este sitio no está dirigido a menores de 18 años. No deben proporcionar datos sin consentimiento de sus padres o tutores.</p>`,

  autorizacion: `
    <p class="legal-date">Conforme al Art. 17 de la Ley 1581 de 2012 y el Art. 45 de la Ley 1480 de 2011</p>
    <div class="highlight-box">La autorización para recibir comunicaciones comerciales es <strong>voluntaria y opcional</strong>. No afecta el derecho a recibir asesoría gratuita.</div>
    <h4>¿Qué autoriza al marcar la casilla de comunicaciones?</h4>
    <p>Al marcar la casilla opcional, usted autoriza a <strong>Jadecol</strong> para contactarle a través de:</p>
    <ul><li><strong>WhatsApp y SMS</strong> al número de celular registrado</li><li><strong>Llamadas telefónicas</strong> en horario de lunes a viernes 8 a.m. – 6 p.m.</li><li><strong>Correo electrónico</strong> si lo proporciona en el futuro</li></ul>
    <h4>¿Qué tipo de comunicaciones recibirá?</h4>
    <ul><li>Novedades y avances del proyecto habitacional en Ubaté</li><li>Consejos y tips sobre subsidios y ahorro para vivienda</li><li>Información sobre disponibilidad, precios y fechas de entrega</li><li>Recordatorios de asesoría y seguimiento a su consulta</li></ul>
    <h4>¿Qué pasa si NO marca esa casilla?</h4>
    <p>Solo se le contactará una vez para responder su consulta. No recibirá comunicaciones adicionales de carácter comercial.</p>
    <h4>¿Cómo revocar esta autorización?</h4>
    <p>Escriba <strong>"STOP"</strong> o <strong>"NO DESEO MÁS INFORMACIÓN"</strong> por el mismo canal y sus datos serán excluidos de inmediato, sin costo ni penalización.</p>`,

  terminos: `
    <p class="legal-date">Versión 1.0 · mayo de 2025</p>
    <h4>1. Naturaleza del sitio</h4>
    <p>Este sitio web es una herramienta de <strong>estudio de mercado</strong> para el proyecto habitacional en Ubaté. La información presentada es orientativa y no constituye una oferta comercial vinculante.</p>
    <h4>2. Información de la calculadora</h4>
    <p>Los valores de subsidio estimados son <strong>aproximaciones informativas</strong> basadas en rangos del SMMLV 2025. El resultado real depende de la evaluación oficial de Fonvivienda, Cajas de Compensación y entidades financieras.</p>
    <div class="highlight-box">Los montos de subsidio mostrados son estimados. La aprobación definitiva la otorgan Fonvivienda, Ministerio de Vivienda o la Caja de Compensación según su perfil.</div>
    <h4>3. Veracidad de la información</h4>
    <p>El usuario es responsable de la veracidad de los datos ingresados. Jadecol no se responsabiliza por decisiones tomadas con base en información incorrecta.</p>
    <h4>4. Propiedad intelectual</h4>
    <p>Todo el contenido de este sitio es propiedad de Jadecol o de sus licenciantes. Queda prohibida su reproducción sin autorización escrita.</p>
    <h4>5. Modificaciones</h4>
    <p>Jadecol se reserva el derecho de modificar estos términos, información del proyecto, precios y disponibilidad en cualquier momento.</p>
    <h4>6. Legislación aplicable</h4>
    <p>Estos términos se rigen por las leyes de la República de Colombia. Controversias ante los jueces competentes de Bogotá D.C.</p>
    <h4>7. Contacto</h4>
    <p><em>info@jadecol.com</em> · WhatsApp: <em>+57 311 262 1281</em></p>`,
}

const TAB_ORDER = ['politica', 'datos', 'autorizacion', 'terminos']

export function initModal() {
  const overlay  = document.getElementById('legalModal')
  const closeBtn = document.getElementById('modalClose')
  const titleEl  = document.getElementById('modalTitle')
  const bodyEl   = document.getElementById('modalBody')
  const tabsEl   = document.getElementById('modalTabs')
  if (!overlay) return

  let activeTab = 'politica'

  function open(tab = 'politica') {
    activeTab = tab
    render()
    overlay.classList.add('open')
    document.body.style.overflow = 'hidden'
  }

  function close() {
    overlay.classList.remove('open')
    document.body.style.overflow = ''
  }

  function switchTab(tab) {
    activeTab = tab
    render()
    bodyEl.scrollTop = 0
  }

  function render() {
    titleEl.textContent = TITLES[activeTab]
    bodyEl.innerHTML = CONTENT[activeTab]
    tabsEl.querySelectorAll('.modal-tab').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === activeTab)
    })
  }

  // Tab clicks
  tabsEl?.querySelectorAll('.modal-tab').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab))
  })

  closeBtn?.addEventListener('click', close)
  overlay.addEventListener('click', e => { if (e.target === overlay) close() })
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close() })

  // All elements with data-modal attribute open the modal
  document.addEventListener('click', e => {
    const trigger = e.target.closest('[data-modal]')
    if (trigger) { e.preventDefault(); open(trigger.dataset.modal) }
  })

  // Expose for HTML onclick (footer links already use data-modal)
  window.openModal = open
}
