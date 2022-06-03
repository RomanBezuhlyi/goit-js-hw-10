import './css/styles.css';

var debounce = require('lodash.debounce');
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from "./fetchCountries";


const DEBOUNCE_DELAY = 300;


const refs = {
    inputEl: document.querySelector(`#search-box`),
    listEl: document.querySelector(`.country-list`),
    infoEl: document.querySelector(`.country-info`)
};
refs.inputEl.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch() {
    const countryNames = refs.inputEl.value.trim(); 
    refs.infoEl.innerHTML = ""; 
    refs.listEl.innerHTML = "";    
   
    if(countryNames) {
    fetchCountries(countryNames)
    .then(renderContriesList)
    .catch(error => {
        Notify.info('Oops, there is no country with that name');
        console.log('error:', error);
    });  
} 
}

function renderContriesList(countries) {
    if(countries.length >=2 && countries.length <= 10) {
    const countryList = countries.map((country) => 
        `
        <li class="country_element">
        <img class="country_flag" src='${country.flags.svg}' alt='flag' width=35px height=20px/>
        <p class="country_name">${country.name.official}</p>
        </li>
        `
    ).join("");

    refs.listEl.insertAdjacentHTML("beforeend", countryList);
    } else {
    
    if(countries.length > 10) {
        Notify.failure('Too many matches found. Please enter a more specific name.');
    }  else  {
        const countryList = countries.map((country) => 
            `
            <li class="country_element">
            <img class="country_flag" src='${country.flags.svg}' alt='flag' width=40px height=25px/>
            <p class="country_name_one">${country.name.official}</p>
            </li>
            <p class="capital">capital: ${country.capital[0]}</p>
            <p class="population">population: ${country.population}</p>
            <p class="languages">languages: ${Object.values(country.languages)}</p>
            
            `
        ).join("");
    
        refs.infoEl.insertAdjacentHTML("beforeend", countryList);
        };
}
}

