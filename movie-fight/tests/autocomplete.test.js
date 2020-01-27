it('Shows an autocomplete', () => {
  createAutoComplete({
    root: document.querySelector('#target'),
    fetchData() {
      return [{ Title: 'Movie 1' }, { Title: 'Movie 2' }, { Title: 'Movie 3' }];
    },
    renderOption(movie) {
      return movie.Title;
    }
  });
});
