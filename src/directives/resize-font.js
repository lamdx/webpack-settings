import { getStyle, setStyle } from './dom';

const resizeFont = (el, minSize) => {
  const scrollWidth = el.scrollWidth;
  const clientWidth = el.clientWidth;
  console.log('scrollWidth ===', scrollWidth);
  console.log('clientWidth ===', clientWidth);
  if (scrollWidth > 0 && clientWidth > 0) {
    if (scrollWidth > clientWidth) {
      const fontSizeStr = getStyle(el, 'fontSize');
      if (fontSizeStr) {
        const newSize =
          parseFloat(fontSizeStr) / (scrollWidth / clientWidth) - 2;
        if (minSize)
          setStyle(
            el,
            'fontSize',
            `${minSize > newSize ? minSize : newSize}px`
          );
        else {
          setStyle(el, 'fontSize', `${newSize}px`);
        }
      }
    } else {
      setStyle(el, 'fontSize', '');
    }
  } else {
    setTimeout(() => resizeFont(el), 50);
  }
};

export default {
  inserted(el, { value }) {
    const { minSize } = value || {};
    resizeFont(el, minSize);
    el.addEventListener('resize', () => resizeFont(el));
  },
  componentUpdated(el) {
    resizeFont(el);
  },
  update(el) {
    resizeFont(el);
  },
  unbind(el) {
    el.removeEventListener('resize', el => resizeFont(el));
  }
};
