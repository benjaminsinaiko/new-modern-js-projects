const imgPlaceholder = 'https://via.placeholder.com/35x50/87c5f8/FFFFFF?text=⊗';

const autoCompleteConfig = {
  renderOption(movie) {
    const imgSrc = movie.Poster === 'N/A' ? imgPlaceholder : movie.Poster;
    return `
      <img src="${imgSrc}" />
      ${movie.Title} (${movie.Year})
    `;
  },
  inputValue(movie) {
    return movie.Title;
  },
  async fetchData(searchTerm) {
    const response = await axios.get('http://www.omdbapi.com/', {
      params: {
        apikey: keys.OMDB_KEY,
        s: searchTerm,
        type: 'movie'
      }
    });

    if (response.data.Error) {
      return [];
    }

    return response.data.Search;
  }
};

createAutoComplete({
  root: document.querySelector('#left-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
  },
  ...autoCompleteConfig
});

createAutoComplete({
  root: document.querySelector('#right-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
  },
  ...autoCompleteConfig
});

let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryElement, side) => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: keys.OMDB_KEY,
      i: movie.imdbID,
      type: 'movie'
    }
  });
  summaryElement.innerHTML = movieTemplate(response.data);

  if (side === 'left') {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }

  if (leftMovie && rightMovie) {
    runComparison();
  }
};

const runComparison = () => {
  const leftSideStats = document.querySelectorAll('#left-summary .notification');
  const rightSideStats = document.querySelectorAll('#right-summary .notification');

  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];

    const leftSideValue = +leftStat.dataset.value;
    const rightSideValue = +rightStat.dataset.value;

    if (rightSideValue > leftSideValue) {
      leftStat.classList.remove('is-info');
      leftStat.classList.add('is-warning');
    } else {
      rightStat.classList.remove('is-info');
      rightStat.classList.add('is-warning');
    }
  });
};

const movieTemplate = movieDetail => {
  const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
  const metascore = +movieDetail.Metascore;
  const imdbRating = +movieDetail.imdbRating;
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));

  const awards = movieDetail.Awards.split(' ').reduce((count, word) => {
    const value = parseInt(word);
    if (isNaN(value)) {
      return count;
    } else {
      return count + value;
    }
  }, 0);

  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}" alt="movie poster" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title} (${movieDetail.Year})</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>
    <article data-value=${awards} class="notification is-info">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article data-value=${dollars} class="notification is-info">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">BoxOffice</p>
    </article>
    <article data-value=${metascore} class="notification is-info">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article data-value=${imdbRating} class="notification is-info">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value=${imdbVotes} class="notification is-info">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
};
