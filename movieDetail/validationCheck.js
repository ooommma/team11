//ID 유효성 검사(null/undefined값, 잘못된 형식, 문자열 길이)
//return만 하면 유효성 검사 함수만 끝나고, 모함수인 creatingReview는 끝나지 않음.
//그래서 이를 끝낼 수 있는 로직을 설계하기 위해 조건에 따라 true or false를 반환하도록 한 것
export function validationCheckID(id) {
  if (id === null || id === undefined || id === "") {
    document.querySelector("#userID").value = "";
    document.getElementById("userPW").value = "";
    document.getElementById("userRV").value = "";
    alert("ID: 아이디를 입력하세요.");
    return false;
  } else if (typeof id !== "string") {
    document.querySelector("#userID").value = "";
    document.getElementById("userPW").value = "";
    document.getElementById("userRV").value = "";
    alert("ID: 잘못된 형식입니다.");
    return false;
  } else if (id.length < 6 || id.length > 11) {
    document.querySelector("#userID").value = "";
    document.getElementById("userPW").value = "";
    document.getElementById("userRV").value = "";
    alert("ID: 아이디는 6~10자리로만 구성하실 수 있습니다.");
    return false;
  }
  return true;
}

//password 유효성 검사(null/undefined값, 잘못된 형식, 문자열 길이)
export function validationCheckPW(password) {
  if (password === null || password === undefined || password === 0) {
    document.querySelector("#userID").value = "";
    document.getElementById("userPW").value = "";
    document.getElementById("userRV").value = "";
    alert("PW: 비밀번호를 입력하세요.");
    return false;
  } else if (!isNaN(password) && password.length === 4) {
    password = Number(password);
    //숫자형식으로 저장하기 위함(문자열로 저장하는 경우를 막기 위함)
  } else if (!isNaN(password) && password.length !== 4) {
    document.querySelector("#userID").value = "";
    document.getElementById("userPW").value = "";
    document.getElementById("userRV").value = "";
    alert("PW: 비밀번호는 4자리 수로만 구성하실 수 있습니다.");
    return false;
  } else if (typeof password !== "number") {
    document.querySelector("#userID").value = "";
    document.getElementById("userPW").value = "";
    document.getElementById("userRV").value = "";
    alert("PW: 잘못된 형식입니다.");
    return false;
  }
  return (password = Number(password));
}

//별점 유효성 검사(별점 체크 여부)
export function validationCheckStars(stars) {
  while (stars === String(false)) {
    document.querySelector("#userID").value = "";
    document.getElementById("userPW").value = "";
    document.getElementById("userRV").value = "";
    alert("Stars: 별점을 눌러주세요.");
    return false;
  }
  return true;
}

//리뷰 유효성 검사(null/undefined값, 잘못된 형식, 문자열 길이)
export function validationCheckRV(review) {
  if (review === null || review === undefined || review === "") {
    document.querySelector("#userID").value = "";
    document.getElementById("userPW").value = "";
    document.getElementById("userRV").value = "";
    alert("RV: 리뷰를 작성하세요.");
    return false;
  } else if (review.length < 50 || review.length > 1000) {
    document.querySelector("#userID").value = "";
    document.getElementById("userPW").value = "";
    document.getElementById("userRV").value = "";
    alert("RV: 리뷰는 50자 이상 1,000자 이내로 작성하실 수 있습니다.");
    return false;
  }
  return true;
}
