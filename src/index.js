import { fetchCountries } from './fetchCountries';
import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  countryInput: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.countryInput.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  e.preventDefault();
  const name = e.target.value.trim();
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';

  fetchCountries(name)
    .then(countries => {
      if (countries.length > 10) {
        return Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else {
        renderCountryList(countries);
      }
    })
    .catch(error =>
      Notiflix.Notify.failure('Oops, there is no country with that name')
    );
}

function renderCountryList(countries) {
  const markup = countries
    .map(({ name, flags }) => {
      return `
            <li class = "list__item">
            <img class = "list__img" src="${flags.svg}" alt="Flag of ${name.official}" width="300" hight="200">
            <p class = "list__name">${name.official}</p>
            </li>
        `;
    })
    .join('');
  refs.countryList.innerHTML = markup;

  if (countries.length === 1) {
    renderCountryInfo(countries);
  }
}

function renderCountryInfo(countries) {
  const markup = countries
    .map(({ capital, population, languages }) => {
      return `
            <li>
              <p><b>Capital</b>: ${capital}</p>
              <p><b>Population</b>: ${population}</p>
              <p><b>Languages</b>: ${Object.values(languages)}</p>
            </li>
        `;
    })
    .join('');
  refs.countryInfo.innerHTML = markup;
}
