1. const와 let만을 이용한 변수 선언 (o)

2. 형 변환
 - string >> number (o)
 - number >> string or boolean >> string ()

 3. 연산자
 - && (o) 
 - || (o)

4. 화살표 함수
 - 일반 화살표 함수 (o)
 - 한 줄로 된 화살표 함수 or 매개변수가 하나인 화살표 함수 ()

5. 조건문 
- if (o)
- if-else (o)
- if-else if-else (o)
- switch (o)
- 삼항연산자 (o)
- 이중 if or if 내부 switch ()

6. 반복문(진영님 작업 중)
- 일반 for 문 (o)
- for ... in 문 or for ... of 문 ()
- 일반 while 문 or do ~ while 문 ()
- break문 or continue문 ()

7. 객체 병합 ()

8. 배열(1) 이 중 두개
 - push, pop, shift, unshift, splice, slice ()

9. 배열(2) 이 중 세개
 - forEach, map, filter, reduce, find ()

10. 자료구조
 - Map or Set (o)

 11. null, undefined (o)

12. callback 함수(setTimeOut, setInterval) ()

13. DOM 제어
 - getElementById (o)
 - querySelector (o)
 - innerHTML (o)
 - addEventListener (o)

14. import, export (o)



function gettingReview() {
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    let result = (key !== null && key !== undefined) ? localStorage.getItem(key) : console.log('오류: 해당 유저가 존재하지 않습니다!');
    let gettingValue;

    switch (key) {
      case null:
      case undefined:
        gettingValue = result;
        break;
      default:
        try {
          gettingValue = JSON.parse(result);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
        break;
    }

    const temp_html = `
      <div class="comment-all" id="comment-all-container">
        <div class="comment-container">
          <div class="comment-items" id="comment-all-info">
            <div class="comment-ID">
              <div class="comment-item">ID ${gettingValue.name}</div>
              <div class="comment-Info">
                <div class="comment-item">별점 ${gettingValue.stars}</div>
                <div class="comment-item">코멘트 ${gettingValue.review}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.querySelector(".commentList").innerHTML += temp_html;
  }
}