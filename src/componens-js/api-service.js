import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api';

const API_KEY = '31040308-bd27c3f4cf506e614f730da89';

export class PixabayApiService {
  #totalPages = 0;
  #page = 1;
  #searchQuery = '';
  #per_page = 40;
  #params = {
    params: {
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
    },
  };

  async fetchImages() {
    const urlAXIOS = `/?key=${API_KEY}&page=${this.#page}&q=${
      this.#searchQuery
    }&per_page=${this.#page}`;

    const { data } = await axios.get(urlAXIOS, this.#params);
    this.incrementPage();
    return data;
  }

  incrementPage() {
    this.#page += 1;
  }

  resetPage() {
    this.#page = 1;
  }

  get page() {
    return this.#page;
  }

  get query() {
    return this.#searchQuery;
  }

  set query(newQuery) {
    this.#searchQuery = newQuery;
  }

  calculateTotalPages(total) {
    this.#totalPages = Math.ceil(total / this.#per_page);
  }

  get isShowLoadMore() {
    return this.#page > this.#totalPages;
  }
}
