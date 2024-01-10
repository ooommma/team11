const TMDB_API_KEY = '';
// TMDB top lated movie list API request code
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: TMDB_API_KEY
    }
};

fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', options)
    .then(response => response.json())
    .then(response => {
        let movies = response['results'];

        movies.forEach(movie => {
            makeMovieCard(movie);
            addIdAlertEvent(movie);
        })

        let moreBtn = `
        <button class="moreBtn" id="moreBtn">more</button>
        `;
        let element = document.getElementById('cardBox');
        element.insertAdjacentHTML('beforeend', moreBtn);

        document.getElementById('searchMovie').addEventListener("keyup", () => {
            searchMovie(movies);
        })

        document.getElementById('moreBtn').addEventListener("click", () => {
            moreFunc();
        })
    })
    .catch(err => console.error(err));

// 카드 생성 함수
function makeMovieCard(movie) {
    let title = movie['title'];
    let overview = movie['overview'];
    let poster_path = movie['poster_path'];
    let vote_average = movie['vote_average'];
    let id = movie['id'];

    let card_html = `
            <div class="movie-card" id="${id}">
                <img src="https://image.tmdb.org/t/p/w300${poster_path}" id="${id}-img" class="poster" alt="poster image">
                <div class="card-body">
                    <div class="card-title"><a href="https://www.themoviedb.org/movie/${id}" target="blank">${title}</a></div>
                    <p class="overview">${overview}</p>
                    <p class="vote-average">${vote_average}</p>
                </div>
            </div>
            `;

    let element = document.getElementById('cardBox');
    element.insertAdjacentHTML('beforeend', card_html);
}

// 카드 이미지 클릭 시 Alert
function addIdAlertEvent(movie) {
    let imgElement = document.getElementById(`${movie['id']}-img`);
    imgElement.addEventListener("click", () => {
        window.alert("영화 id: " + movie['id']);
    });
}

// title로 검색 (대소문자, 공백 구분 X)
function searchMovie(movies) {
    let searchStr = (document.getElementById('searchMovie').value).toUpperCase().replace(" ", "");

    movies.forEach(movie => {
        let title = (movie['title']).toUpperCase().replace(" ", "");
        let element = document.getElementById(`${movie['id']}`);

        if (title.includes(searchStr)) {
            element.style.display = "grid";
        } else {
            element.style.display = "none";
        }

    })

    //moreBtn display
    if (searchStr !== "") {
        document.getElementById('moreBtn').style.display = "none";
    } else {
        document.getElementById('moreBtn').style.display = "block";
    }
}

let page = 2;

function moreFunc() {
    let url = 'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=' + page;
    fetch(url, options)
        .then(response => response.json())
        .then(response => {
            let movies = response['results'];

            movies.forEach(movie => {
                makeMovieCard(movie);
                addIdAlertEvent(movie);
            })

            let moreBtn = document.getElementById('moreBtn');
            let element = document.getElementById('cardBox');
            element.appendChild(moreBtn);

            document.getElementById('searchMovie').addEventListener("keyup", () => {
                searchMovie(movies);
            })
        })
        .catch(err => console.error(err));

    page++;
}