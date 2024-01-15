/* 변수 선언 */
const movieWrapper = document.getElementById("movieWrapper");
const castWrapper = document.getElementById("castWrapper");
const loadingBox = document.getElementsByClassName("loading");
/* id값 받아오기 */
function getQueryParam(param) {
  let searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(param);
}

/* 로딩중 인디케이터 없애기 */
function hideLoadingIndicator() {
  for (let i = 0; i < loadingBox.length; i++) {
    loadingBox[i].style.display = "none";
  }
  movieWrapper.style.display = "block";
  castWrapper.style.display = "block";
}

const TMDB_API_KEY =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4N2Y4NWM2NjNlZjQ2N2JkOTRiODIzNGExZTk0NjgwZiIsInN1YiI6IjY1OGUzYjk4NGMxYmIwMDg1MzMyYWNkNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hVqOyx3rkW6bjMu8bg82orc6YZpg-oJj6vlnLNqfcu4";

/* view.html 로딩시 */
document.addEventListener("DOMContentLoaded", function () {
  // URL에서 영화 ID 추출
  let movieId = getQueryParam("id");

  /* 로딩 화면을 위해 Wrapper 가림 */
  movieWrapper.style.display = "none";
  castWrapper.style.display = "none";

  //movieId 없는 경우 상세페이지 이동 불가
  if (!movieId) {
    alert("잘못된 접근입니다.");
    location.replace("../index.html");
  }

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `${TMDB_API_KEY}`
    }
  };

  const apiDetail = "https://api.themoviedb.org/3/movie/" + movieId + "?language=ko-KO";
  const apiVideos = "https://api.themoviedb.org/3/movie/" + movieId + "/videos?language=ko-KO"; // 두 번째 API 주소
  const apiCredits = "https://api.themoviedb.org/3/movie/" + movieId + "/credits?language=ko-KO"; // 세 번째... 출연진

  Promise.all([fetch(apiDetail, options), fetch(apiVideos, options), fetch(apiCredits, options)])
    .then((responses) => {
      // 모든 응답을 JSON으로 변환
      return Promise.all(responses.map((response) => response.json()));
    })
    .then((data) => {
      //장르 데이터 obj 쪼개서 넣기
      let movieGenres = [];
      data[0].genres.forEach((element) => {
        movieGenres.push(element.name);
      });

      // 최소 1.4초 동안 로딩 표시 후 숨김 처리
      setTimeout(hideLoadingIndicator, 1000);

      //트레일러 비디오 찾기
      let movieVideos = data[1].results;
      let movieTrailerIdx = movieVideos.findIndex((str) => str.type === "Trailer");
      let movieTrailer =
        movieTrailerIdx !== -1
          ? `<iframe width="560" height="315" src="https://www.youtube.com/embed/${movieVideos[movieTrailerIdx].key}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; " allowfullscreen></iframe>`
          : `<p class="no-trailer">트레일러가 없습니다.</p>`;

      let movieContents = `
      <div id="movieMain" class="mainCenter">
        <div class='mainBox'>
            <div class='movieImg'>
                <img src='https://image.tmdb.org/t/p/w500/${data[0].backdrop_path}'>
            </div>
            <div class='movieGenres'>
                ${movieGenres}
            </div>
            <p class='movieRT'>${data[0].runtime}분</p>
        </div>
      </div>

      <div class="Leftright">
        <div id="movieLeft" class="leftPoster">
          <div class='leftBox'>
            <h2 class="movieTitle">${data[0].title}</h2>
            <div class="movieImg">
              <img src='https://image.tmdb.org/t/p/w500/${data[0].poster_path}' alt="" style="width: 300px" />
            </div>
            <p>영화 평점 : ${data[0].vote_average}</p>
          </div>
        </div>
        <!--//movieLeft-->

        <div id="movieRight" class="rightContent">  
          <div class='rightBox'>
            <div>
              <p>영화 별점 주기</p>
              <p>평균 별점</p>
            </div> 
            <div>
              <p>찜하기</p>
              <p>코멘트</p>
            </div>
            <p>${data[0].overview}</p>
            <div id="movieVideo">
              <p>영화 예고편</p>
              ${movieTrailer} 
            </div>
          </div>
        </div>
        <!--//movieRight-->

      </div>`;

      /* 영화 상세정보(기본)과 트레일러 삽입 */
      movieWrapper.insertAdjacentHTML("beforeend", movieContents);

      /* 
        출연진 정보 삽입
        1) 감독(director) 정보 찾아옴
        1-2) 감독 한국 프로필과 매칭하여 credits에 삽입
        2) cast 정보 for of로 credits에 삽입
        -> 감독 포함 8개
        3) forEach로 캐스트 정보 불러오기
      */
      let credits = [];
      let director = data[2].crew.find((element) => element.job === "Director");
      credits.push(director);

      for (var value of data[2].cast) {
        credits.push(value);
      }

      credits.slice(0, 8).forEach((element) => {
        let profileImg = element.profile_path
          ? `<img src='https://image.tmdb.org/t/p/w500/${element.profile_path}' class="img-size">`
          : `<p>이미지가 없습니다.</p>`;
        let creditsInfo = `
        <div class="cast-items" id="cast-all-info">
          <div class="cast-itemImg">
            ${profileImg}
          </div>
          <div class="cast-itemInfo">
            <div class="cast-item">${element.original_name}</div>
            <div class="cast-item">${element.known_for_department}</div>
          </div>
        </div>
        `;
        castWrapper.insertAdjacentHTML("beforeend", creditsInfo);
      });
    })
    .catch((err) => {
      console.error("API 호출 중 오류 발생:", err);
      for (let i = 0; i < loadingBox.length; i++) {
        loadingBox[i].innerHTML = "데이터를 불러오는 데 실패했습니다.";
      }
      setTimeout(hideLoadingIndicator, 1000);
    });
});
