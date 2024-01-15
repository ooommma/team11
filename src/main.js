document.addEventListener("DOMContentLoaded", async () => {
  parent.location.hash = "#searchMovie";
  const sort = new URLSearchParams(window.location.search).get("sort");
  const page = new URLSearchParams(window.location.search).get("page");
  if (!sort) window.location.href = `index.html?sort=top_rated&page=1`;

  let movies = await getMovieData(sort, page);
  makeMovieCard(movies);
  sendIDToDetailPage(movies);
  makePageBtns(sort, page);
  sorting(sort);

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

  let koUrl = `https://api.themoviedb.org/3/movie/${sort}?language=ko-KR&page=${page}`;
  let enUrl = `https://api.themoviedb.org/3/movie/${sort}?language=en-US&page=${page}`;
  await Promise.all([fetch(koUrl, options), fetch(enUrl, options)])
    .then((response) => Promise.all(response.map((res) => res.json())))
    .then((data) => {
      let movieData = [...data[0]["results"]];
      movieData.reduce((_, cur, idx) => {
        if (!cur["overview"]) {
          cur["overview"] = data[1]["results"][idx]["overview"];
        }
      });
      movies = movieData;
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

    if (overview.length > 100) overview = overview.substr(0, 100) + "...";
    if (!overview) overview = "데이터가 아직 수집되지 않았습니다.";
    let card_html = `
            <div class="movie-card" id="${id}">
                <img src="https://image.tmdb.org/t/p/w300${poster_path}" id="${id}-img" class="poster" alt="이미지가 없습니다.">
                <div class="card-body">
                    <div class="card-title"><a href="https://www.themoviedb.org/movie/${id}" target="blank">${title}</a></div>
                    <p class="overview">${overview}</p>
                    <button class="detailBtn" data-id="${id}">자세히 보기</button>
                    <p class="vote-average">★${vote_average}</p>
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
  // 유효성 검사
  if (!/^[A-Z|0-9|ㄱ-ㅎ|ㅏ-ㅣ|가-힣]*$/.test(searchStr)) {
    if (/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"|  ]/g.test(searchStr)) {
      alert("특수문자는 입력 불가합니다. 영어나 한국어를 입력 해주세요.");
    } else {
      alert("영어나 한국어로 입력 해주세요.");
    }
    document.getElementById("searchMovie").value = null;
    return;
  }

  movies.forEach((movie) => {
    let originTitle = movie["original_title"].toUpperCase().replace(" ", "");
    let title = movie["title"].replace(" ", "");
    let element = document.getElementById(`${movie["id"]}`);

    if (originTitle.includes(searchStr) || title.includes(searchStr)) {
      element.style.display = "grid";
    } else {
      element.style.display = "none";
    }
  });
}

// 상세 페이지로 ID값 전송 함수
function sendIDToDetailPage() {
  const movieList = document.querySelectorAll(".detailBtn");
  movieList.forEach((movie) => {
    movie.addEventListener("click", () => {
      const movieId = movie.getAttribute("data-id");
      window.location.href = `src/view.html?id=${movieId}`;
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

// 솔팅 함수
function sorting(curSort) {
  let sortArr = ["top_rated", "now_playing", "popular", "upcoming"];
  document.getElementById(curSort).style.color = "black";
  document.getElementById(curSort).style.fontWeight = 700;

  sortArr.forEach((sort) => {
    document.getElementById(sort).addEventListener("click", () => {
      window.location.href = `index.html?sort=${sort}&page=1`;
    });
  });
}
