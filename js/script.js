const global = {
  currentPage: window.location.pathname,
};

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
      console.log('home');
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
