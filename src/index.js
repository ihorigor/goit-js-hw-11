import { PixabayApiService } from './componens-js/api-service';
import { refs } from './componens-js/refs';
import { smoothScroll } from './componens-js/smooth-scroll';
import { spinerPlay, spinerStop } from './componens-js/spiner';
import { imagesTpl } from './componens-js/create-markup';
import { lightbox } from './componens-js/simplelightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

refs.searchForm.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

const imgApi = new PixabayApiService();
infiniteScroll();

async function onFormSubmit(event) {
  event.preventDefault();
  clearImagesContainer();

  const {
    elements: { searchQuery },
  } = event.currentTarget;
  imgApi.query = searchQuery.value.trim().toLowerCase();

  if (!imgApi.query) {
    Notify.failure('Sorry, enter a valid query. Please try again.');
    return;
  }

  refs.loadMoreBtn.classList.remove('is-hidden');
  await onLoadMore();
}

async function onLoadMore() {
  try {
    spinerPlay();
    const { totalHits, hits } = await imgApi.fetchImages();
    imgApi.calculateTotalPages(totalHits);
    const markup = imagesTpl(hits);
    refs.imagesContainer.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();
    smoothScroll();

    if (hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      refs.loadMoreBtn.classList.add('is-hidden');
      return;
    }

    if (imgApi.page === 2) {
      Notify.success(`Hooray! We found ${totalHits} images.`);
    }

    if (imgApi.isShowLoadMore) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      refs.loadMoreBtn.classList.add('is-hidden');
    }
  } catch (error) {
    onFetchError(error);
  } finally {
    spinerStop();
  }
}

function infiniteScroll() {
  const options = {
    root: null,
    rootMargin: '100px',
    threshold: 1.0,
  };

  const callback = async function (entries, observer) {
    entries.forEach(async entry => {
      if (entry.isIntersecting) {
        observer.unobserve(entry.target);

        try {
          const { totalHits, hits } = await imgApi.fetchImages();
          const markup = imagesTpl(hits);
          refs.imagesContainer.insertAdjacentHTML('beforeend', markup);
          lightbox.refresh();
          smoothScroll();
          Notify.success(`Hooray! We found ${totalHits} images.`);
          if (!imgApi.isShowLoadMore) {
            const target = document.querySelector('.photo-card:last-child');
            io.observe(target);
          }
        } catch (error) {
          Notify.failure(error.message, 'Something went wrong!');
          onFetchError(error);
        }
      }
    });
  };
  const io = new IntersectionObserver(callback, options);
}

function clearImagesContainer() {
  imgApi.resetPage();
  refs.imagesContainer.innerHTML = '';
  refs.loadMoreBtn.classList.add('is-hidden');
}

function onFetchError(error) {
  Notify.failure(error.message);
  clearImagesContainer();
}
