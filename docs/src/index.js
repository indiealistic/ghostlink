'use strict';

import ghostlink from 'source/ghostlink.js';
import barba from '@barba/core';
import barbaCss from '@barba/css';

barba.hooks.once(() => {
  ghostlink.init({
    on: 'a:not(.github-button)'
  });
});

barba.hooks.enter(() => {
  ghostlink.refresh();
});

barba.use(barbaCss);

barba.init({
  preventRunning: true
});
