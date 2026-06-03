// ── STICKY CTA
export function initSticky() {
  const bar = document.getElementById('stickyCta')
  const closeBtn = document.getElementById('stickyClose')
  const linkBtn = document.getElementById('stickyBtn')
  const formSec = document.getElementById('registro')
  if (!bar || !formSec) return

  let manualHide = false
  let timer = null

  function hide(ms = 0) {
    manualHide = true
    bar.classList.remove('visible')
    clearTimeout(timer)
    if (ms > 0) timer = setTimeout(() => { manualHide = false }, ms)
  }

  function evaluate() {
    const heroH = document.querySelector('#hero')?.offsetHeight || 600

    // Resetear si vuelve arriba
    if (window.scrollY < heroH * 0.2) {
      manualHide = false
    }

    if (manualHide) return

    const formTop = formSec.getBoundingClientRect().top
    const pastHero = window.scrollY > heroH * 0.6
    const atForm = formTop < window.innerHeight * 0.85 && formTop > -200

    // NUEVO: Detectar si el usuario llegó al final de la página (Footer/Políticas)
    // El -50 es un margen de tolerancia en píxeles.
    const isAtBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50;

    // Se hace visible solo si pasó el hero, NO está en el formulario y NO está en el footer
    bar.classList.toggle('visible', pastHero && !atForm && !isAtBottom)
  }

  window.addEventListener('scroll', evaluate, { passive: true })
  closeBtn?.addEventListener('click', () => hide(8000))
  linkBtn?.addEventListener('click', () => hide(1500))
}

// ── REVEAL ON SCROLL
export function initReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible')
        observer.unobserve(e.target)
      }
    })
  }, { threshold: 0.12 })

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
}
