import { login } from './login';
import { displayMap } from './map';

// DOM ELEMENTS
const mapDiv = document.getElementById('map');
const loginForm = document.querySelector('.form');

// DELEGATION
if (mapDiv) {
  const locations = JSON.parse(mapDiv.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  // VALUES

  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}
