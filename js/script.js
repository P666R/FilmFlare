const global = {
  currentPage: window.location.pathname,
};

//* Display popular movies
async function displayPopularMovies() {
  const { results } = await fetchAPIData('movie/popular');
  createElement(results, 'movie', 'movies');
}

//* Display popular shows
async function displayPopularShows() {
  const { results } = await fetchAPIData('tv/popular');
  createElement(results, 'tv', 'shows');
}

//* Create Element
function createElement(results, typeURL, typeId) {
  results.forEach((ele) => {
    const div = document.createElement('div');
    div.classList.add('card');

    const a = document.createElement('a');
    a.setAttribute('href', `${typeURL}-details.html?id=${ele.id}`);
    a.setAttribute('alt', ele.name ?? ele.title);

    const img = document.createElement('img');
    img.classList.add('card-img-top');
    img.src = ele.poster_path
      ? `https://image.tmdb.org/t/p/w500${ele.poster_path}`
      : '../images/no-image.jpg';

    const div2 = document.createElement('div');
    div2.classList.add('card-body');

    const h5 = document.createElement('h5');
    h5.classList.add('card-title');
    h5.textContent = ele.name ?? ele.title;

    const p = document.createElement('p');
    p.classList.add('card-text');

    const small = document.createElement('small');
    small.classList.add('text-muted');
    small.textContent = `Release: ${ele.first_air_date ?? ele.release_date}`;

    p.append(small);
    div2.append(h5, p);
    a.append(img);
    div.append(a, div2);
    document.querySelector(`#popular-${typeId}`).append(div);
  });
}

//* Display movie details
async function displayMovieDetails() {
  //! Query string
  const movieId = window.location.search.split('=')[1];
  const movie = await fetchAPIData(`movie/${movieId}`);

  const div = document.createElement('div');
  div.classList.add('details-top');

  const posterDiv = document.createElement('div');
  const img = document.createElement('img');
  img.classList.add('card-img-top');
  img.alt = movie.title;

  if (movie.poster_path) {
    img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  } else {
    img.src = '../images/no-image.jpg';
  }

  posterDiv.appendChild(img);

  const detailsDiv = document.createElement('div');
  const h2 = document.createElement('h2');
  h2.textContent = movie.title;

  const rating = document.createElement('p');
  const starIcon = document.createElement('i');
  starIcon.classList.add('fas', 'fa-star', 'text-primary');
  rating.appendChild(starIcon);
  rating.appendChild(
    document.createTextNode(`${movie.vote_average.toFixed(1)} / 10`)
  );

  const releaseDate = document.createElement('p');
  releaseDate.classList.add('text-muted');
  releaseDate.textContent = `Release Date: ${movie.release_date}`;

  const overview = document.createElement('p');
  overview.textContent = movie.overview;

  const genresHeading = document.createElement('h5');
  genresHeading.textContent = 'Genres';

  const genresList = document.createElement('ul');
  genresList.classList.add('list-group');
  movie.genres.forEach((genre) => {
    const genreItem = document.createElement('li');
    genreItem.textContent = genre.name;
    genresList.appendChild(genreItem);
  });

  const homepageLink = document.createElement('a');
  homepageLink.href = movie.homepage;
  homepageLink.target = '_blank';
  homepageLink.classList.add('btn');
  homepageLink.textContent = movie.homepage;

  detailsDiv.append(
    h2,
    rating,
    releaseDate,
    overview,
    genresHeading,
    genresList,
    homepageLink
  );

  div.append(posterDiv, detailsDiv);

  const bottomDiv = document.createElement('div');
  bottomDiv.classList.add('details-bottom');

  const movieInfoHeading = document.createElement('h2');
  movieInfoHeading.textContent = 'Movie Info';

  const infoList = document.createElement('ul');
  const budgetItem = document.createElement('li');
  budgetItem.innerHTML = `<span class="text-secondary">Budget:</span> $${addCommasToNumber(
    movie.budget
  )}`;
  infoList.appendChild(budgetItem);

  const revenueItem = document.createElement('li');
  revenueItem.innerHTML = `<span class="text-secondary">Revenue:</span> $${addCommasToNumber(
    movie.revenue
  )}`;
  infoList.appendChild(revenueItem);

  const runtimeItem = document.createElement('li');
  runtimeItem.innerHTML = `<span class="text-secondary">Runtime:</span> ${movie.runtime} minutes`;
  infoList.appendChild(runtimeItem);

  const statusItem = document.createElement('li');
  statusItem.innerHTML = `<span class="text-secondary">Status:</span> ${movie.status}`;
  infoList.appendChild(statusItem);

  bottomDiv.append(movieInfoHeading, infoList);

  const productionCompaniesHeading = document.createElement('h4');
  productionCompaniesHeading.textContent = 'Production Companies';

  const productionCompaniesDiv = document.createElement('div');
  productionCompaniesDiv.classList.add('list-group');
  movie.production_companies.forEach((company, index) => {
    const companySpan = document.createElement('span');
    companySpan.textContent = `${
      index !== movie.production_companies.length - 1
        ? `${company.name}, `
        : `${company.name}`
    }  `;
    productionCompaniesDiv.appendChild(companySpan);
  });

  bottomDiv.append(productionCompaniesHeading, productionCompaniesDiv);

  const movieDetailsDiv = document.querySelector('#movie-details');
  movieDetailsDiv.appendChild(div);
  movieDetailsDiv.appendChild(bottomDiv);
}

//* Fetch data from TMDB API
async function fetchAPIData(endpoint) {
  const API_KEY = '4bfda97b16a7e26755c34b364c88b26a';
  const API_URL = 'https://api.themoviedb.org/3/';

  showSpinner();

  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-IN`
  );
  const data = await response.json();

  hideSpinner();
  return data;
}

//* Show spinner
function showSpinner() {
  document.querySelector('.spinner').classList.add('show');
}

//* Hide spinner
function hideSpinner() {
  document.querySelector('.spinner').classList.remove('show');
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

//
function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
      displayPopularShows();
      break;

    case '/movie-details.html':
      displayMovieDetails();
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
