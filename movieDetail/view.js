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
