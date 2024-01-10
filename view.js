function getQueryParam(param) {
    var searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(param);
}

document.addEventListener('DOMContentLoaded', function () {
    // URL에서 영화 ID 추출
    var movieId = getQueryParam('id');
    if (movieId) {
        document.getElementById('movie-details').innerHTML = '영화 ID: ' + movieId;
    }

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: ''
        }
    };

    fetch('https://api.themoviedb.org/3/movie/'+  movieId  +'?language=en-US', options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
});