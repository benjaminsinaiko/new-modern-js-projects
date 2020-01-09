const fetchData = async searchTerm => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: keys.OMDB_KEY,
      s: searchTerm
    }
  });

  if (response.data.Error) {
    return [];
  }

  return response.data.Search;
};

const input = document.querySelector('input');

const onInput = async event => {
  const movies = await fetchData(event.target.value);
  console.log(movies);

  for (let movie of movies) {
    const div = document.createElement('div');

    div.innerHTML = `
      <img src="${movie.Poster}" />
      <h1>${movie.Title} (${movie.Year})</h1>
    `;

    document.querySelector('#target').appendChild(div);
  }
};

input.addEventListener('input', debounce(onInput, 500));
