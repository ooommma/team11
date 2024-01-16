//유효성 검사 함수 import
import { validationCheckID, validationCheckPW, validationCheckStars, validationCheckRV } from "./validationCheck.js";

/* 변수 선언 */

const movieWrapper = document.getElementById("movieWrapper");
const castWrapper = document.getElementById("castWrapper");
const loadingBox = document.getElementsByClassName("loading");

let movieId;

/* main페이지에서 id값 받아오기 */
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
  castWrapper.style.display = "grid";
}

const TMDB_API_KEY =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4N2Y4NWM2NjNlZjQ2N2JkOTRiODIzNGExZTk0NjgwZiIsInN1YiI6IjY1OGUzYjk4NGMxYmIwMDg1MzMyYWNkNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hVqOyx3rkW6bjMu8bg82orc6YZpg-oJj6vlnLNqfcu4";

/* view.html 로딩시 */
document.addEventListener("DOMContentLoaded", function () {
  // URL에서 영화 ID 추출
  movieId = getQueryParam("id");

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
  const engDetail = "https://api.themoviedb.org/3/movie/" + movieId + "?language=en-US";

  Promise.all([
    fetch(apiDetail, options),
    fetch(apiVideos, options),
    fetch(apiCredits, options),
    fetch(engDetail, options)
  ])
    .then((responses) => {
      // 모든 응답을 JSON으로 변환
      return Promise.all(responses.map((response) => response.json()));
    })
    .then((data) => {
      //장르 데이터 obj 쪼개서 넣기
      let movieGenres = [];
      data[0].genres.forEach((element) => {
        movieGenres.push(" " + element.name);
      });

      // 최소 1초 동안 로딩 표시 후 숨김 처리
      setTimeout(hideLoadingIndicator, 1000);

      //트레일러 비디오 찾기
      let movieVideos = data[1].results;
      let movieTrailerIdx = movieVideos.findIndex((str) => str.type === "Trailer");
      let movieTrailer =
        movieTrailerIdx !== -1
          ? `<iframe width="560" height="315" src="https://www.youtube.com/embed/${movieVideos[movieTrailerIdx].key}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; " allowfullscreen></iframe>`
          : `<p class="no-trailer">트레일러가 없습니다.</p>`;

      // 한국어 개요가 없는 경우 영어 개요 제공
      let overview = !data[0].overview ? data[3].overview : data[0].overview;
      if (!overview) overview = "아직 데이터가 수집되지 않았습니다.";

      let movieContents = `
      <div id="movieMain" class="mainCenter">
        <div class='mainBox'>
            <div class='movieImg'>
                <img src='https://image.tmdb.org/t/p/w500/${data[0].backdrop_path}'>
            </div>
            <p class='movieGenres'>${movieGenres}</p>
            <p class='movieRT'>${data[0].runtime}분</p>
        </div>
      </div>

      <div class="Leftright">
        <div id="movieLeft" class="leftPoster">
          <div class="movieImg">
            <h2 class="movieTitle">${data[0].title}</h2>
            <img src='https://image.tmdb.org/t/p/w500/${data[0].poster_path}' alt="" style="width: 300px" />
          </div>
          <p>★${data[0].vote_average}</p>
        </div>
        <!--//movieLeft-->

        <div id="movieRight" class="rightContent">  
          <div class='rightBox'>
            <p id="averageRate" class="averageRate"></p>
            <p class="tit">개요</p>
            <p>${overview}</p>
            <div id="movieVideo">
              <p class="tit">영화 예고편</p>
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

      for (let value of data[2].cast) {
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

      displayAverageRating();
    })
    .catch((err) => {
      console.error("API 호출 중 오류 발생:", err);
      for (let i = 0; i < loadingBox.length; i++) {
        loadingBox[i].innerHTML = "데이터를 불러오는 데 실패했습니다.";
      }
      setTimeout(hideLoadingIndicator, 1000);
    });
});

/* 
  평점 계산 
  1) calculateAverageRating() 함수로 평점 배열을 받아 평균을 계산
  2) displayAverageRating() 함수로 로컬 스토리지에서 평점 데이터를 불러와 평균을 계산한 후 이를 HTML 요소에 표시 
*/
function calculateAverageRating(ratings) {
  const sum = ratings.reduce((acc, curr) => acc + curr, 0);
  return ratings.length > 0 ? (sum / ratings.length).toFixed(2) : 0;
}

function displayAverageRating() {
  // 로컬 스토리지에서 평점 데이터 불러오기
  let ratings = [];
  for (let key in localStorage) {
    if (!localStorage.hasOwnProperty(key)) {
      continue; // setItem, getItem 등의 키를 건너뜀
    }
    let stars = JSON.parse(localStorage.getItem(key)).stars;
    let movie = JSON.parse(localStorage.getItem(key)).movie;
    let count = stars.split("★").length - 1;
    if(movieId === movie){
      ratings.push(count);
    }
  }
  // 평균 계산
  const average = calculateAverageRating(ratings);
  // HTML에 평균 표시
  document.getElementById("averageRate").innerHTML = `
  <p class="tit">평균 별점</p>
  ${average}
  `;
}

//ID, Password, Review 인풋 값을 Map 자료구조로 처리함.
//creatingReview()와 document.querySelector("#ToDeleteButton").addEventListener라는 독립된 두 함수에서 동시에 사용되기에 전역 변수로 선언
let myMap = new Map();

//리뷰 작성 함수
function creatingReview() {
  //함수 내 변수 선언
  let id = document.querySelector("#userID").value;
  let password = document.getElementById("userPW").value;
  let selectedStars = document.querySelector('input[name="reviewStar"]:checked');
  let stars = selectedStars ? selectedStars.value : String(false);
  let review = document.getElementById("userRV").value;

  //유효성 검사(movieId > id > password > stars > review 순으로 진행됨)
  //내부 if문은 별점 체크란 초기화 용

  if (validationCheckID(id) === false) {
    if (selectedStars) {
      selectedStars.checked = false;
    }
    return;
  } else if (validationCheckPW(password) === false) {
    if (selectedStars) {
      selectedStars.checked = false;
    }
    return;
  } else if (validationCheckStars(stars) === false) {
    if (selectedStars) {
      selectedStars.checked = false;
    }
    return;
  } else if (validationCheckRV(review) === false) {
    if (selectedStars) {
      selectedStars.checked = false;
    }
    return;
  }

  //유효성 검사를 통과한 데이터를 객체형태로 수집

  //1. 텍스트박스에 입력된 데이터가 myMap 자료구조에 각각의 키로 저장되도록 유도
  //my.set 안의 value는 JSON형 데이터가 아니기 때문에 ""를 굳이 쓸 필요는 없다고 함(?)
  myMap.set(id, { movie: movieId, name: id, password: password, stars: stars });

  //2. 객체 병합을 위해 리뷰는 따로 변수를 선언하여 해당 변수에 할당
  let forMergingRV = { review: review };

  //3. 객체 병합, 자료 모음 완성
  let MergedId = JSON.stringify({ ...myMap.get(id), ...forMergingRV });
  console.log(MergedId);

  //4. myMap 자료구조에 저장된 값을 로컬 스토리지로 이동하여 저장
  localStorage.setItem(id, MergedId);

  location.reload();
}

//리뷰 업로드용 함수
function gettingReview() {
  //페이지 로드 시 혹시라도 있을 찌꺼기 데이터를 청소함
  document.querySelector(".commentList").innerHTML = "";

  //로컬 스토리지에 문자열로 저장된 객체({ID, Password, Stars, Review})를 다시 객체로 되돌리는 과정
  for (let i = 0; i < localStorage.length; i++) {
    //해당 인덱스의 key 값에 해당하는 value를 찾아 [변수 key]에 할당
    let key = localStorage.key(i);
    let result;
    let gettingValue;

    //해당 인덱스에 저장돼 있던 로컬 스토리지의 key-value가 삭제되어도 각 key의 인덱스는 바뀌지 않음
    //따라서, localStorage.key(i) 중에는 필연적으로 [null/undefined]가 발생함.
    //이는 JSON.parse()가 읽을 수 없는 값이기에 에러가 발생함으로, 이를 미리 걸러주는 작업이 필요함
    if (key !== null && key !== undefined) {
      result = localStorage.getItem(key);
      gettingValue = result;

      switch (key) {
        case null:
          gettingValue = result;
          break;
        case undefined:
          gettingValue = result;
          break;
        default:
          try {
            //거르고 난 후 존재하는 key 값의 value를 한당받은 변수 result는 JSON.parse()의 인수가 되어 문자열 > 객체 로 형변환이 일어남
            gettingValue = JSON.parse(result);
          } catch (error) {
            console.error("Error parsing JSON", error);
          }
          break;
      }
    } else {
      console.log("오류: 해당 유저가 존재하지 않습니다.");
    }

    //이후 객체의 key 값에 맞추어 ID(name), stars, review를 코멘트 카드의 형식에 맞게 출력되도록 코드 작성
    //"N/A"는 혹시라도 null/undefined가 발생할 경우 에러를 일으켜 웹페이지를 정지시키는 것을 막기 위해 대신 해당 코멘트 카드만 N/A처리하도록 하기 위한 로직의 인수

    //영화 id에 맞는 코멘트 카드를 출력하기 위한 로직
    if (movieId !== gettingValue.movie) {
      continue; //없으면 로컬스토리지 첫번째 키에 해당하는 코멘트 카드만 출력됨
    } else {
    }
    const temp_html = `
       <div class="comment-all">
           <div class="comment-container">
                 <div class="comment-items">
                   <div class="comment-ID">
                     <!-- gettingValue가 정의되지 않은 경우에 대한 처리 추가 -->
                     <div class="comment-item">ID ${gettingValue.name ? gettingValue.name : "N/A"}</div>
                   <div class="comment-Info">
                     <div class="comment-item">별점 ${gettingValue.stars ? gettingValue.stars : "N/A"}</div>
                     <div class="comment-item" style="white-space: pre-line; overflow-wrap: break-word;">${
                       gettingValue.review ? gettingValue.review.replace(/\n/g, "<br>") : "N/A"
                     }</div>
                   </div>
                 </div>
             </div>
         </div>
   </div>
   `;
    //+= 안하고 = 하면 한 장만 출력됨
    document.querySelector(".commentList").innerHTML += temp_html;
  }
}

//ID = ToWriteButton 버튼을 클릭하면 creatingReview가 실행됨
document.querySelector("#ToWriteButton").addEventListener("click", creatingReview);

//ID = ToDeleteButton 버튼을 클릭하면 ID, password 인풋에 해당하는 map자료와 로컬 스토리지 자료가 삭제됨.
//myMap 자료가 먼저 지워지도록 한 이유는, 로컬 스토리지와 연동돼있기 때문
document.querySelector("#ToDeleteButton").addEventListener("click", () => {
  const id = document.querySelector("#userID").value;
  const password = document.getElementById("userPW").value;
  if (!JSON.parse(localStorage.getItem(id))) {
    alert("해당 유저가 존재하지 않습니다.");
    return;
  }
  if (JSON.parse(localStorage.getItem(id)).name === id && JSON.parse(localStorage.getItem(id)).password === password) {
    myMap.delete(id);
    localStorage.removeItem(id);
    alert("삭제가 완료되었습니다.");
  } else {
    alert("비밀번호가 맞지 않습니다.");
  }
  location.reload();
});
//DOM이 로딩될 때 gettingReview가 작동하도록 하지 않으면, HTML파싱 과정에서 js모듈이 먼저 파싱이 끝나기 전에 접근해서 not defined가 발생할 수 있음.
document.addEventListener("DOMContentLoaded", gettingReview);
