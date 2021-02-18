import * as dom from '../__mocks__/dom';
import defaults from '../src/defaults';
import ghostlink from '../src/ghostlink';

let spy = jest.SpyInstance;
let html;

beforeEach(() => {
  html = dom.init();
});

afterEach(() => {
  dom.clear();
});

it('has defaults', () => {
  ghostlink.init();

  expect(ghostlink.props).toStrictEqual(defaults);
  expect(ghostlink.props.await).toBeUndefined();
  expect(ghostlink._navigating).toBeFalsy();
  expect(ghostlink._worker).toBeUndefined();
});

it('should have nodelist properly populated', () => {
  dom.clear();

  let link1 = document.createElement('a');
  document.body.appendChild(link1);
  let link2 = document.createElement('a');
  document.body.appendChild(link2);

  ghostlink.init();

  expect(ghostlink._nodelist.length).toBe(2);
});

describe('handle properties', () => {
  it('could have custom props that override defaults', () => {
    ghostlink.init({
      timeout: 700
    });

    expect(ghostlink.props.timeout).toBe(700);
  });

  it('could have props.on set with a custom query selector', () => {
    ghostlink.init({
      on: document.querySelectorAll('a')
    });

    expect(ghostlink._nodelist.length).toBe(1);
  });

  it('should use previous props on refresh', () => {
    ghostlink.init({
      timeout: 700
    });

    ghostlink.refresh();

    expect(ghostlink.props.timeout).toBe(700);
  });
});

describe('handle event listeners', () => {
  it('should listen to mouseenter', () => {
    ghostlink.init();

    spy = jest.spyOn(ghostlink, '_engage');
    html.link.dispatchEvent(html.event.mouse.enter);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(html.link.getAttribute('data-ghostlink')).toBe('engage');

    spy.mockRestore();
  });

  it('should listen to mouseleave', () => {
    ghostlink.init();

    spy = jest.spyOn(ghostlink, '_cancel');
    html.link.dispatchEvent(html.event.mouse.leave);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(html.link.getAttribute('data-ghostlink')).toBe('cancel');

    spy.mockRestore();
  });

  it('should listen to click', () => {
    ghostlink.init({
      preventClick: false
    });

    spy = jest.spyOn(ghostlink, '_click');
    html.link.dispatchEvent(html.event.mouse.click);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(html.link.getAttribute('data-ghostlink')).toBe('cancel');

    spy.mockRestore();
  });

  it ('should listen to `Enter` key', () => {
    ghostlink.init();

    spy = jest.spyOn(ghostlink, '_keydown');
    html.link.dispatchEvent(html.event.keyboard.enter);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(ghostlink._navigating).toBeTruthy();

    spy.mockRestore();
  });

  it('should remove event listeners on destroy', () => {
    ghostlink.init();
    ghostlink.destroy();

    spy = jest.spyOn(ghostlink, '_engage');
    html.link.dispatchEvent(html.event.mouse.enter);

    expect(spy).toHaveBeenCalledTimes(0);
    spy.mockRestore();
  });

  it('should do nothing on click when preventClick is enable', () => {
    ghostlink.init({
      preventClick: true
    });

    spy = jest.spyOn(ghostlink, '_click');
    html.link.dispatchEvent(html.event.mouse.click);

    expect(spy).toHaveReturned();
    spy.mockRestore();
  });

  it('should return on engage when navigating', () => {
    ghostlink.init({
      preventClick: false
    });

    html.link.dispatchEvent(html.event.mouse.click);
    spy = jest.spyOn(ghostlink, '_engage');
    html.link.dispatchEvent(html.event.mouse.enter);

    expect(spy).toHaveReturned();
    spy.mockRestore();
  });

  it('should return on cancel when navigating', () => {
    ghostlink.init({
      preventClick: false
    });

    spy = jest.spyOn(ghostlink, '_cancel');
    html.link.dispatchEvent(html.event.mouse.click);

    expect(spy).toHaveReturned();
    spy.mockRestore();
  });

  it('should return when worker is undefined', () => {
    ghostlink.init({
      preventClick: false
    });

    ghostlink._worker = undefined;

    spy = jest.spyOn(ghostlink, '_cancel');
    html.link.dispatchEvent(html.event.mouse.click);

    expect(spy).toHaveReturned();
    spy.mockRestore();
  });
});

describe('handle promises', () => {
  it('should dispatch navigation when using a timeout promise', () => {
    ghostlink.init();

    spy = jest.spyOn(ghostlink, '_dispatch');
    html.link.dispatchEvent(html.event.mouse.enter);

    return ghostlink.props.current.promise.then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      expect(ghostlink._navigating).toBeTruthy();
      expect(html.link.getAttribute('data-ghostlink')).toBe('dispatch');
      spy.mockRestore();
    });
  });

  it('should dispatch navigation when using a custom promise', () => {
    ghostlink.init({
      await: (resolve) => {
        resolve();
      }
    });

    spy = jest.spyOn(ghostlink, '_dispatch');
    html.link.dispatchEvent(html.event.mouse.enter);

    return ghostlink.props.current.promise.then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      expect(ghostlink._navigating).toBeTruthy();
      expect(html.link.getAttribute('data-ghostlink')).toBe('dispatch');
      spy.mockRestore();
    });
  });

  it('should reset when promise throw an exception', () => {
    ghostlink.init({
      await: () => {
        throw new Error('exception');
      }
    });

    spy = jest.spyOn(ghostlink, '_reset');
    html.link.dispatchEvent(html.event.mouse.enter);

    return ghostlink.props.current.promise.then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      spy.mockRestore();
    });
  });

  it('should reject promise on cancel', () => {
    ghostlink.init({
      await: (resolve, reject) => {
        reject();
      }
    });

    html.link.dispatchEvent(html.event.mouse.enter);
    spy = jest.spyOn(ghostlink, '_worker');
    html.link.dispatchEvent(html.event.mouse.leave);

    return ghostlink.props.current.promise.then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      spy.mockRestore();
    });
  });
});
