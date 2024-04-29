/**
 * requestAnimationFrame polyfill
 */

let prev = Date.now();

function fallback(fn) {
  const curr = Date.now();
  const ms = Math.max(0, 16 - (curr - prev));
  const id = setTimeout(fn, ms);
  prev = curr + ms;
  return id;
}

const root = window;

const iRaf =
  root.requestAnimationFrame || root.webkitRequestAnimationFrame || fallback;

const iCancel =
  root.cancelAnimationFrame ||
  root.webkitCancelAnimationFrame ||
  root.clearTimeout;

export function raf(fn) {
  return iRaf.call(root, fn);
}
export function doubleRaf(fn) {
  raf(() => {
    raf(fn);
  });
}
export function cancel(id) {
  iCancel.call(root, id);
}

export function scrollLeftTo(el, to, duration) {
  let count = 0;
  const from = el.scrollLeft;
  const frames = duration === 0 ? 1 : Math.round((duration * 1000) / 16);

  function animate() {
    el.scrollLeft += (to - from) / frames;

    if (++count < frames) {
      raf(animate);
    }
  }

  animate();
}
