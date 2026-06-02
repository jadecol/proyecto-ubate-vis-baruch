import { initGlobe }   from './js/globe.js'
import { initTips }    from './js/tips.js'
import { initStepper } from './js/stepper.js'
import { initSticky }  from './js/sticky.js'
import { initModal }   from './js/modal.js'
import { initReveal }  from './js/reveal.js'

initGlobe()
initTips()
initStepper()
initSticky()
initModal()
initReveal()

// Script de Urgencia/Escasez Activa
setTimeout(() => {
  const cuposText = document.getElementById('cupos-text')
  const cuposBar = document.getElementById('cupos-bar')
  if (cuposText && cuposBar) {
    cuposText.innerText = '6/25'
    cuposBar.style.width = '64%'
    cuposText.classList.add('scarcity-alert')
    setTimeout(() => {
      cuposText.classList.remove('scarcity-alert')
    }, 1000)
  }
}, 45000)
