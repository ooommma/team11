export function gettingComment() {
  for (let i = 0; i < localStorage.length; i++) {
    if (localStorage.key(i) === null || localStorage.key(i) === undefined) {
      localStorage.removeItem(localStorage.key(i));
      return;
    }

    const gettingValue = JSON.parse(localStorage.getItem(localStorage.key(i)));
    const temp_html = `
        <div class="comment-all" id="comment-all-container">
            <div class="comment-container">
                  <div class="comment-items" id="comment-all-info">
                    <div class="comment-ID">
                      <div class="comment-item">ID ${gettingValue.name}</div>
                    </div>
                    <div class="comment-Info">
                      <div class="comment-item">별점</div>
                      <div class="comment-item">코멘트 ${gettingValue.comment}</div>
                    </div>
                  </div>
              </div>
          </div>
    </div>
    `;

    document.querySelector(".commentList").innerHTML += temp_html;
  }
}

export function ToWriteButton() {
  document.querySelector("#ToWriteButton").addEventListener("click", creatingComment);
}

export function ToDeleteButton() {
  document.querySelector("#ToDeleteButton").addEventListener("click", function () {
    const id = document.querySelector("#userID").value;
    const password = Number(document.getElementById("userPW").value);
    if (
      JSON.parse(localStorage.getItem(id)).name === id &&
      JSON.parse(localStorage.getItem(id)).password === password
    ) {
      localStorage.removeItem(id);
    }
    location.reload();
  });
}

function getQueryParam(param) {
    var searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(param);
}
const TMDB_API_KEY = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4N2Y4NWM2NjNlZjQ2N2JkOTRiODIzNGExZTk0NjgwZiIsInN1YiI6IjY1OGUzYjk4NGMxYmIwMDg1MzMyYWNkNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hVqOyx3rkW6bjMu8bg82orc6YZpg-oJj6vlnLNqfcu4";

// 

document.addEventListener('DOMContentLoaded', function() {
    // URL에서 영화 ID 추출
    var movieId = getQueryParam('id');
    if (movieId) {
        console.log('영화 ID: ' + movieId);
        //document.getElementById('movie-details').innerHTML = '영화 ID: ' + movieId;
    }

    const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `${TMDB_API_KEY}`
    }
    };

    const apiURL1 = 'https://api.themoviedb.org/3/movie/' + movieId + '?language=ko-KO';
    const apiURL2 = 'https://api.themoviedb.org/3/movie/' + movieId + '/videos?language=ko-KO'; // 두 번째 API 주소

    Promise.all([
        fetch(apiURL1, options),
        fetch(apiURL2, options) // 두 번째 API 호출에 동일한 옵션을 사용하거나 필요에 따라 수정
    ]).then(responses => {
        // 모든 응답을 JSON으로 변환
        return Promise.all(responses.map(response => response.json()));
    }).then(data => {
        // data[0]는 첫 번째 API 응답, data[1]는 두 번째 API 응답
        console.log('첫 번째 API 응답:', data[0]);
        console.log('두 번째 API 응답:', data[1]);
    }).catch(err => {
        console.error('API 호출 중 오류 발생:', err);
    });

    // fetch('https://api.themoviedb.org/3/movie/'+movieId+'?language=ko-KO', options)
    // .then(response => response.json())
    // .then(response => console.log(response))
    // .catch(err => console.error(err));
});
