const global = {
  currentPage: window.location.pathname,
};

async function displayPopularMovies() {
  const { results } = await fetchAPIData('movie/popular');

  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('card');

    const a = document.createElement('a');
    a.setAttribute('href', `movie-details.html?id=${movie.id}`);
    a.setAttribute('alt', movie.title);

    const img = document.createElement('img');
    img.classList.add('card-img-top');
    img.src = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : '../images/no-image.jpg';

    const div2 = document.createElement('div');
    div2.classList.add('card-body');

    const h5 = document.createElement('h5');
    h5.classList.add('card-title');
    h5.textContent = movie.title;

    const p = document.createElement('p');
    p.classList.add('card-text');

    const small = document.createElement('small');
    small.classList.add('text-muted');
    small.textContent = `Release: ${movie.release_date}`;

    p.append(small);
    div2.append(h5, p);
    a.append(img);
    div.append(a, div2);
    document.querySelector('#popular-movies').append(div);
  });
}

//* Fetch data from TMDB API
async function fetchAPIData(endpoint) {
  const API_KEY = '4bfda97b16a7e26755c34b364c88b26a';
  const API_URL = 'https://api.themoviedb.org/3/';

  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-IN`
  );

  const data = await response.json();

  return data;
}

//* Highlight active link
function highlightActiveLink() {
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach((navLink) => {
    if (navLink.getAttribute('href') === global.currentPage) {
      navLink.classList.add('active');
    }
  });
}

//* Init app
function init() {
  //! Basic router
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      displayPopularMovies();
      break;

    case '/shows.html':
      console.log('shows');
      break;

    case '/movie-details.html':
      console.log('movie-details');
      break;

    case '/tv-details.html':
      console.log('tv-details');
      break;

    case '/search.html':
      console.log('search');
      break;
  }

  highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);
