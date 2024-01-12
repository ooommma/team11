function getQueryParam(param) {
  let searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(param);
}
const TMDB_API_KEY =
  "";

document.addEventListener("DOMContentLoaded", function () {
  // URL에서 영화 ID 추출
  let movieId = getQueryParam("id");

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

  const apiURL1 = "https://api.themoviedb.org/3/movie/" + movieId + "?language=ko-KO";
  const apiURL2 = "https://api.themoviedb.org/3/movie/" + movieId + "/videos?language=ko-KO"; // 두 번째 API 주소

  Promise.all([
    fetch(apiURL1, options),
    fetch(apiURL2, options) // 두 번째 API 호출에 동일한 옵션을 사용하거나 필요에 따라 수정
  ])
    .then((responses) => {
      // 모든 응답을 JSON으로 변환
      return Promise.all(responses.map((response) => response.json()));
    })
    .then((data) => {
      // data[0]는 첫 번째 API 응답, data[1]는 두 번째 API 응답
      console.log("첫 번째 API 응답:", data[0]);
      const movieMain = document.getElementById("movieMain");
      const movieLeft = document.getElementById("movieLeft");
      const movieRight = document.getElementById("movieRight");

      //장르 데이터 obj 쪼개서 넣기
      let movieGenres = [];
      data[0].genres.forEach((element) => {
        movieGenres.push(element.name);
      });

      //트레일러 비디오 찾기
      let movieVideos = data[1].results;
      let movieTrailerIdx = movieVideos.findIndex((str) => str.type === "Trailer");
      let movieTrailer =
        movieTrailerIdx !== -1
          ? `<iframe width="560" height="315" src="https://www.youtube.com/embed/${movieVideos[movieTrailerIdx].key}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
          : `<p class="no-trailer">트레일러가 없습니다.</p>`;
      

      let mainContents = `
        <div class='mainBox'>
            <div class='movieImg'>
                <img src='https://image.tmdb.org/t/p/w500/${data[0].backdrop_path}'>
            </div>
            <div class='movieGenres'>
                ${movieGenres}
            </div>
            <p class='movieRT'>${data[0].runtime}분</p>
        </div>`;
      let leftContents = `
        <div class='leftBox'>
          <h2 class="movieTitle">${data[0].title}</h2>
          <div class="movieImg">
            <img src='https://image.tmdb.org/t/p/w500/${data[0].poster_path}' alt="" style="width: 300px" />
          </div>
          <p>영화 평점 : ${data[0].vote_average}</p>
        </div>
      `;
      let rightContents = `
        <div>
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
        </div>`;

      movieMain.insertAdjacentHTML("beforeend", mainContents);
      movieLeft.insertAdjacentHTML("beforeend", leftContents);
      movieRight.insertAdjacentHTML("beforeend", rightContents);

      console.log("두 번째 API 응답:", movieTrailer);
      //console.log("두 번째 API 응답:", data[1].results[0]);
    })
    .catch((err) => {
      console.error("API 호출 중 오류 발생:", err);
    });
});
