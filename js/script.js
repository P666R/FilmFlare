const global = {
  currentPage: window.location.pathname,
  search: {
    term: '',
    type: '',
    page: 1,
    totalPages: 1,
  },
  api: {
    apiKey: '4bfda97b16a7e26755c34b364c88b26a',
    apiURL: 'https://api.themoviedb.org/3/',
  },
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

//* Display details (movies/shows)
async function displayDetails(type) {
  //! Query string
  const id = window.location.search.split('=')[1];
  const data = await fetchAPIData(`${type}/${id}`);

  //* Overlay for background image
  displayBackgroundImage(type, data.backdrop_path);

  const div = document.createElement('div');

  div.innerHTML = `
    <div class="details-top">
      <div>
        ${
          data.poster_path
            ? `<img
              src="https://image.tmdb.org/t/p/w500${data.poster_path}"
              class="card-img-top"
              alt="${data.title || data.name}"
            />`
            : `<img
              src="../images/no-image.jpg"
              class="card-img-top"
              alt="${data.title || data.name}"
            />`
        }
      </div>
      <div>
        <h2>${data.title || data.name}</h2>
        <p>
          <i class="fas fa-star text-primary"></i>
          ${data.vote_average.toFixed(1)} / 10
        </p>
        ${
          type === 'movie'
            ? `<p class="text-muted">Release Date: ${data.release_date}</p>`
            : `<p class="text-muted">Last Air Date: ${data.last_air_date}</p>`
        }
        <p>
          ${data.overview}
        </p>
        <h5>Genres</h5>
        <ul class="list-group">
          ${data.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
        </ul>
        <a href="${data.homepage}" target="_blank" class="btn">Visit ${
    type === 'movie' ? 'Movie' : 'Show'
  } Homepage</a>
      </div>
    </div>
    <div class="details-bottom">
      <h2>${type === 'movie' ? 'Movie' : 'Show'} Info</h2>
      <ul>
        ${
          type === 'movie'
            ? `<li><span class="text-secondary">Budget:</span> $${addCommasToNumber(
                data.budget
              )}</li>
               <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(
                 data.revenue
               )}</li>
               <li><span class="text-secondary">Runtime:</span> ${
                 data.runtime
               } minutes</li>
               <li><span class="text-secondary">Status:</span> ${
                 data.status
               }</li>`
            : `<li><span class="text-secondary">Number of Episodes:</span> ${data.number_of_episodes}</li>
               <li><span class="text-secondary">Last Episode To Air:</span> ${data.last_episode_to_air.name}</li>
               <li><span class="text-secondary">Status:</span> ${data.status}</li>`
        }
      </ul>
      <h4>Production Companies</h4>
      <div class="list-group">
        ${data.production_companies
          .map((company) => `<span>${company.name}</span>`)
          .join(', ')}
      </div>
    </div>
  `;

  document
    .querySelector(`#${type === 'movie' ? 'movie' : 'show'}-details`)
    .appendChild(div);
}

//* Display backdrop on details pages
function displayBackgroundImage(type, backDropPath) {
  const overlayDiv = document.createElement('div');
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backDropPath})`;
  overlayDiv.style.backgroundSize = 'cover';
  overlayDiv.style.backgroundPosition = 'center';
  overlayDiv.style.backgroundRepeat = 'no-repeat';
  overlayDiv.style.height = '100vh';
  overlayDiv.style.width = '100vw';
  overlayDiv.style.position = 'absolute';
  overlayDiv.style.top = '0';
  overlayDiv.style.left = '0';
  overlayDiv.style.zIndex = '-1';
  overlayDiv.style.opacity = '0.15';

  type === 'movie'
    ? document.querySelector('#movie-details').appendChild(overlayDiv)
    : document.querySelector('#show-details').appendChild(overlayDiv);
}

//* Search movies/shows
async function search() {
  const queryString = window.location.search;
  //! Params from query string
  const urlParams = new URLSearchParams(queryString);
  global.search.term = urlParams.get('search-term').trim();
  global.search.type = urlParams.get('type');

  if (global.search.term !== '' && global.search.term !== null) {
    //TODO make request and display results
    const results = await searchAPIData();
    console.log(results);
  } else {
    console.log(global.search);
    showAlert('Please enter search term');
  }
}

//* Display slider movies
async function displaySlider() {
  const { results } = await fetchAPIData('movie/now_playing');

  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');

    div.innerHTML = `
   <a href="movie-details.html?id=${movie.id}">
              <img src=https://image.tmdb.org/t/p/w500${movie.poster_path} alt=${movie.title} />
            </a>
            <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${movie.vote_average} / 10
            </h4>
    `;
    document.querySelector('.swiper-wrapper').appendChild(div);

    initSwiper();
  });
}

function initSwiper() {
  new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}

//* Fetch data from TMDB API
async function fetchAPIData(endpoint) {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiURL;

  showSpinner();
  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-IN`
  );
  const data = await response.json();
  hideSpinner();
  return data;
}

//* Search data from TMDB API
async function searchAPIData() {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiURL;

  showSpinner();
  const response = await fetch(
    `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-IN&query=${global.search.term}`
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

//* Show alert
function showAlert(message, className) {
  const alertEl = document.createElement('div');
  alertEl.classList.add('alert', className);
  alertEl.appendChild(document.createTextNode(message));
  document.querySelector('#alert').appendChild(alertEl);

  setTimeout(() => {
    alertEl.remove();
  }, 3000);
}

//* Add commas to numbers
function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

//* Init app
function init() {
  //! Basic router
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      displaySlider();
      displayPopularMovies();
      break;

    case '/shows.html':
      displayPopularShows();
      break;

    case '/movie-details.html':
      displayDetails('movie');
      break;

    case '/tv-details.html':
      displayDetails('tv');
      break;

    case '/search.html':
      search();
      break;
  }

  highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);
