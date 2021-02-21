import ghostlink from 'source/ghostlink.js';
import barba from '@barba/core';
import gsap from 'gsap';

ghostlink.init({
  on: 'a:not(.github-button)',
});

barba.hooks.enter(() => {
  ghostlink.refresh();
});

barba.init({
  preventRunning: true,
  transitions: [{
    name: 'default',
    leave(data) {
      return gsap.to(data.current.container, {
        opacity: 0,
        duration: 0.4,
      });
    },
    enter(data) {
      return gsap.from(data.next.container, {
        opacity: 0,
        duration: 0.4,
      });
    },
  }],
});
