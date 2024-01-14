document.addEventListener("DOMContentLoaded", async () => {
  const sort = new URLSearchParams(window.location.search).get("sort");
  const page = new URLSearchParams(window.location.search).get("page");
  if (!sort) window.location.href = `index.html?sort=top_rated&page=1`;

  let movies = await getMovieData(sort, page);
  makeMovieCard(movies);
  sendIDToDetailPage(movies);
  makePageBtns(sort, page);

  document.getElementById("searchMovie").addEventListener("keyup", () => {
    searchMovie(movies);
  });
});

// 영화 데이터 생성 함수
async function getMovieData(sort, page) {
  if (!sort) return;

  let movies = [];
  // TMDB API request Code
  const TMDB_API_KEY =
    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4N2Y4NWM2NjNlZjQ2N2JkOTRiODIzNGExZTk0NjgwZiIsInN1YiI6IjY1OGUzYjk4NGMxYmIwMDg1MzMyYWNkNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hVqOyx3rkW6bjMu8bg82orc6YZpg-oJj6vlnLNqfcu4";

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: TMDB_API_KEY
    }
  };

  let url = `https://api.themoviedb.org/3/movie/${sort}?language=ko-KR&page=${page}`;
  await fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      movies.push(...data["results"]);
    })
    .catch((error) => {
      console.log(error);
      alert("잘못된 API 접근입니다.");
    });

  return movies;
}

// 카드 생성 함수
function makeMovieCard(movies) {
  movies.forEach((movie) => {
    let title = movie["title"];
    let overview = movie["overview"];
    let poster_path = movie["poster_path"];
    let vote_average = movie["vote_average"];
    let id = movie["id"];

    let card_html = `
            <div class="movie-card" id="${id}" data-id="${id}">
                <img src="https://image.tmdb.org/t/p/w300${poster_path}" id="${id}-img" class="poster" alt="poster image">
                <div class="card-body">
                    <div class="card-title"><a href="https://www.themoviedb.org/movie/${id}" target="blank">${title}</a></div>
                    <p class="overview">${overview}</p>
                    <p class="vote-average">${vote_average}</p>
                </div>
            </div>
            `;

    let element = document.getElementById("cardBox");
    element.insertAdjacentHTML("beforeend", card_html);
  });
}

// title로 검색 (대소문자, 공백 구분 X)
function searchMovie(movies) {
  let searchStr = document.getElementById("searchMovie").value.toUpperCase().replace(" ", "");
  movies.forEach((movie) => {
    let title = movie["title"].toUpperCase().replace(" ", "");
    let element = document.getElementById(`${movie["id"]}`);

    if (title.includes(searchStr)) {
      element.style.display = "grid";
    } else {
      element.style.display = "none";
    }
  });
}

// 상세 페이지로 ID값 전송 함수
function sendIDToDetailPage() {
  const movieList = document.querySelectorAll(".movie-card");
  movieList.forEach((movie) => {
    movie.addEventListener("click", () => {
      const movieId = movie.getAttribute("data-id");
      window.location.href = `movieDetail/view.html?id=${movieId}`;
    });
  });
}

// 페이징 함수
function makePageBtns(curSort, curPage) {
  let goto = curPage;
  while (1) {
    goto++;
    if ((goto - 1) % 5 === 0) break;
  }

  let pageHTML = `<span class="preBtn" id="preBtn">이전</span>`;
  if (curPage <= 5) pageHTML = "";
  for (let i = 5; i > 0; i--) {
    pageHTML += `
    <span class="pages" id="${goto - i}">${goto - i}</span>`;
  }
  pageHTML += `
  <span class="nextBtn" id="nextBtn">다음</span>`;

  document.getElementById("pageBox").innerHTML = pageHTML;
  document.getElementById(curPage).style.color = "black";

  // 페이지 이동
  [...document.querySelectorAll(".pages")].map((element) => {
    let pageID = element.getAttribute("id");
    element.addEventListener("click", () => {
      window.location.href = `index.html?sort=${curSort}&page=${pageID}`;
    });
  });

  if (curPage > 5) {
    document.getElementById("preBtn").addEventListener("click", () => {
      window.location.href = `index.html?sort=${curSort}&page=${goto - 10}`;
    });
  }

  document.getElementById("nextBtn").addEventListener("click", () => {
    window.location.href = `index.html?sort=${curSort}&page=${goto}`;
  });
}
