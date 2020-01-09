const fetchData = async searchTerm => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: keys.OMDB_KEY,
      s: searchTerm
    }
  });

  console.log(response.data);
};

const input = document.querySelector('input');
