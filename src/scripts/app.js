/**
 * Import resources
 */

import '../styles/app.scss'

function importAll(r) {
  return r.keys().map(r)
}

importAll(require.context('../images/', false, /\.(png|jpe?g|svg)$/))

import barba from '@barba/core'

import transition from './transitions/gsap'

document.addEventListener('DOMContentLoaded', () => {
  // Global hooks for animation.
  barba.hooks.before(() => {
    barba.wrapper.classList.add('is-animating')
  })
  barba.hooks.after(() => {
    barba.wrapper.classList.remove('is-animating')
  })

  // Init.
  barba.init({
    debug: true,
    transitions: [transition],
  })
})
