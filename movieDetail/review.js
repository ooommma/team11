//유효성 검사 함수 import
import { validationCheckID, validationCheckPW, validationCheckStars, validationCheckRV } from "./validationCheck.js";

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

  //유효성 검사(id > password > stars > review 순으로 진행됨)
  //location.reload()는 별점 체크란 초기화 용
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
  //my.set 안의 value는 JSON형 데이터가 아니기 때문에 ""를 굳이 쓸 필요는 없다고 함(?)

  myMap.set(id, { name: id, password: password, stars: stars });

  //2. 객체 병합을 위해 리뷰는 따로 변수를 선언하여 해당 변수에 할당
  let forMergingRV = { review: review };

  //3. 객체 병합, 자료 모음 완성
  let MergedId = JSON.stringify({ ...myMap.get(id), ...forMergingRV });
  console.log(MergedId);

  //4. myMap 자료구조에 저장된 값을 로컬 스토리지로 이동하여 저장
  localStorage.setItem(id, MergedId);

  document.querySelector("#userID").value = "";
  document.getElementById("userPW").value = "";
  document.getElementById("userRV").value = "";
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
  if (JSON.parse(localStorage.getItem(id)).name === id && JSON.parse(localStorage.getItem(id)).password === password) {
    myMap.delete(id);
    localStorage.removeItem(id);
  }
  location.reload();
});
//DOM이 로딩될 때 gettingReview가 작동하도록 하지 않으면, HTML파싱 과정에서 js모듈이 먼저 파싱이 끝나기 전에 접근해서 not defined가 발생할 수 있음.
document.addEventListener("DOMContentLoaded", gettingReview);
