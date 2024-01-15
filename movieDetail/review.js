//유효성 검사 함수 import
import { validationCheckID, validationCheckPW, validationCheckStars, validationCheckRV } from "./validationCheck.js";

let myMap = new Map();

//리뷰 작성 함수
function creatingReview() {
  //함수 내 변수 선언
  let id = document.querySelector("#userID").value;
  let password = document.getElementById("userPW").value;
  const starElements = document.getElementsByClassName("Star");
  let selectedStars = document.querySelector('input[name="reviewStar"]:checked');
  //null 값 체크
  let stars = selectedStars ? selectedStars.value : String(false);
  let review = document.getElementById("userRV").value;

  //유효성 검사(id > password > review 순으로 진행됨)
  if (validationCheckID(id) === false) {
    location.reload();
    return;
  } else if (validationCheckPW(password) === false) {
    location.reload();
    return;
  } else if (validationCheckStars(stars) === false) {
    location.reload();
    return;
  } else if (validationCheckRV(review) === false) {
    location.reload();
    return;
  }

  //유효성 검사를 통과한 데이터를 객체형태로 수집

  //1. 텍스트박스에 입력된 데이터가 myMap 자료구조에 각각의 키로 저장되도록 유도

  myMap.set(id, { name: id, password: password, stars: stars });

  let forMergingRV = { review: review };

  let MergedId = JSON.stringify({ ...myMap.get(id), ...forMergingRV });
  console.log(MergedId);

  //myMap 자료구조에 저장된 값을 로컬 스토리지로 이동하여 저장
  localStorage.setItem(id, MergedId);

  document.querySelector("#userID").value = "";
  document.getElementById("userPW").value = "";
  document.getElementById("userRV").value = "";
  location.reload();
}

function gettingReview() {
  document.querySelector(".commentList").innerHTML = "";
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    let result;
    let gettingValue;

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
            gettingValue = JSON.parse(result);
          } catch (error) {
            console.error("Error parsing JSON", error);
          }
          break;
      }
    } else {
      console.log("오류: 해당 유저가 존재하지 않습니다.");
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
                     <div class="comment-item">코멘트 ${gettingValue.review ? gettingValue.review : "N/A"}</div>
                   </div>
                 </div>
             </div>
         </div>
   </div>
   `;
    document.querySelector(".commentList").innerHTML += temp_html;
  }
}

document.querySelector("#ToWriteButton").addEventListener("click", creatingReview);

document.querySelector("#ToDeleteButton").addEventListener("click", () => {
  const id = document.querySelector("#userID").value;
  const password = document.getElementById("userPW").value;
  if (JSON.parse(localStorage.getItem(id)).name === id && JSON.parse(localStorage.getItem(id)).password === password) {
    myMap.delete(id);
    localStorage.removeItem(id);
  }
  location.reload();
});
document.addEventListener("DOMContentLoaded", gettingReview);
