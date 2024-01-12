export function validationCheckID(id) {
  if (id === null || id === undefined || id === "") {
    document.querySelector("#userID").value = "";
    document.getElementById("userPW").value = "";
    document.getElementById("userRV").value = "";
    alert("ID: 아이디를 입력하세요.");
    return (id = false);
  } else if (typeof id !== "string") {
    document.querySelector("#userID").value = "";
    document.getElementById("userPW").value = "";
    document.getElementById("userRV").value = "";
    alert("ID: 잘못된 형식입니다.");
    return (id = false);
  } else if (id.length < 6 || id.length > 11) {
    document.querySelector("#userID").value = "";
    document.getElementById("userPW").value = "";
    document.getElementById("userRV").value = "";
    alert("ID: 아이디는 6~10자리로만 구성하실 수 있습니다.");
    return (id = false);
  }
  return (id = id);
}
// 여기서 return은 해당 함수의 실행을 그만 두고 빠져 나가는 거임.
export function validationCheckPW(password) {
  if (password === null || password === undefined || password === 0) {
    document.querySelector("#userID").value = "";
    document.getElementById("userPW").value = "";
    document.getElementById("userRV").value = "";
    alert("PW: 비밀번호를 입력하세요.");
    return (password = false);
  } else if (!isNaN(password) && password.length === 4) {
    password = Number(password);
  } else if (!isNaN(password) && password.length !== 4) {
    document.querySelector("#userID").value = "";
    document.getElementById("userPW").value = "";
    document.getElementById("userRV").value = "";
    alert("PW: 비밀번호는 4자리 수로만 구성하실 수 있습니다.");
    return (password = false);
  } else if (typeof password !== "number") {
    document.querySelector("#userID").value = "";
    document.getElementById("userPW").value = "";
    document.getElementById("userRV").value = "";
    alert("PW: 잘못된 형식입니다.");
    return (password = false);
  }
  return (password = Number(password));
}
export function validationCheckRV(review) {
  if (review === null || review === undefined || review === "") {
    document.querySelector("#userID").value = "";
    document.getElementById("userPW").value = "";
    document.getElementById("userRV").value = "";
    alert("RV: 리뷰를 작성하세요.");
    return (review = false);
  } else if (review.length < 50 || review.length > 1000) {
    document.querySelector("#userID").value = "";
    document.getElementById("userPW").value = "";
    document.getElementById("userRV").value = "";
    alert("RV: 리뷰는 50자 이상 1,000자 이내로 작성하실 수 있습니다.");
    return (review = false);
  }
  return (review = review);
}
