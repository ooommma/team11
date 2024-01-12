function getQueryParam(param) {
  var searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(param);
}
const TMDB_API_KEY =
  "";

document.addEventListener("DOMContentLoaded", function () {
  // URL에서 영화 ID 추출
  var movieId = getQueryParam("id");
  if (movieId) {
    console.log("영화 ID: " + movieId);
    //document.getElementById('movie-details').innerHTML = '영화 ID: ' + movieId;
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
      console.log("두 번째 API 응답:", data[1]);
    })
    .catch((err) => {
      console.error("API 호출 중 오류 발생:", err);
    });

});
