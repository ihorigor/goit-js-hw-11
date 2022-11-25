import { refs } from './refs';

export const smoothScroll = () => {
  const { height: cardHeight } =
    refs.imagesContainer.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 1,
    behavior: 'smooth',
  });
};
