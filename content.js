// Lắng nghe sự kiện 'mouseup' để kiểm tra nếu phím Alt được nhấn và có văn bản được chọn
document.addEventListener("mouseup", function (event) {
  if (event.altKey) {
    let selectedText = window.getSelection().toString();
    if (selectedText.length > 0) {
      let range = window.getSelection().getRangeAt(0);
      let rect = range.getBoundingClientRect();
      showModal(selectedText, rect);
    }
  }
});

// Hàm hiển thị modal
function showModal(text, rect) {
  checkApiKeyIsSetted().then((isSetApiKey) => {
    let modal = document.createElement("div");
    modal.id = "highlightModal";
    modal.classList.add("modal");
    modal.innerHTML = isSetApiKey
      ? `
            <div class="modal-content">
              <span class="close-button">&times;</span>
              <p>${text}</p>
              <input type="text" id="descriptionInput" placeholder="Enter description">
              <button id="saveButton">Save</button>
            </div>
            `
      : `
            <div class="modal-content">
              <span class="close-button">&times;</span>
              <p>API Key not set. Please enter API Key:</p>
              <input type="text" id="apiKeyInput" placeholder="Enter API Key">
              <button id="saveApiKeyButton">Save API Key</button>
            </div>
            `;
    document.body.appendChild(modal);
    modal.style.display = "block";

    // Định vị modal tại vị trí đã chọn
    let modalContent = modal.querySelector(".modal-content");
    modalContent.style.position = "absolute";
    modalContent.style.top = `${rect.bottom + window.scrollY}px`;
    modalContent.style.left = `${rect.left + window.scrollX}px`;

    // Đóng modal khi nhấp vào nút đóng
    let closeButton = modal.querySelector(".close-button");
    closeButton.addEventListener("click", function () {
      document.body.removeChild(modal);
      document.removeEventListener("keydown", handleEscKey);
    });

    // Đóng modal khi nhấp bên ngoài nội dung của modal
    modal.addEventListener("click", function (event) {
      if (!modalContent.contains(event.target)) {
        document.body.removeChild(modal);
        document.removeEventListener("keydown", handleEscKey);
      }
    });

    // Đóng modal khi nhấn phím Escape
    function handleEscKey(event) {
      if (event.key === "Escape") {
        document.body.removeChild(modal);
        document.removeEventListener("keydown", handleEscKey);
      }
    }
    document.addEventListener("keydown", handleEscKey);

    if (isSetApiKey) {
      // Lưu văn bản và mô tả khi API key đã được thiết lập
      let saveButton = modal.querySelector("#saveButton");
      saveButton.addEventListener("click", function () {
        let description = modal.querySelector("#descriptionInput").value;
        saveText(text, description);
      });
    } else {
      // Lưu API key nếu chưa được thiết lập
      let saveApiKeyButton = modal.querySelector("#saveApiKeyButton");
      saveApiKeyButton.addEventListener("click", function () {
        let apiKey = modal.querySelector("#apiKeyInput").value;
        saveApiKey(apiKey);
      });
    }
  });
}

// Kiểm tra xem API key đã được lưu trữ hay chưa
function checkApiKeyIsSetted() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["apiKey"], function (result) {
      if (result.apiKey) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

// Lưu văn bản và mô tả
function saveText(text, description) {
  console.log(text, description);
  chrome.storage.local.get(["apiKey"], function (result) {
    if (result.apiKey) {
      let apiEndpoint = "https://your-api-endpoint.com/save";
      let payload = {
        text: text,
        description: description,
      };

      fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${result.apiKey}`,
        },
        body: JSON.stringify(payload),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          alert("Saved: " + text + "\nDescription: " + description);
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Error: " + error);
        });
    } else {
      alert("API Key not saved. Please enter and save the API Key first.");
    }
  });
}

// Lưu API key
function saveApiKey(apiKey) {
  chrome.storage.local.set({ apiKey: apiKey }, function () {
    console.log("API Key is saved:", apiKey);
    alert("API Key has been saved.");
  });
}

// Thêm stylesheet cho modal
let styles = document.createElement("link");
styles.rel = "stylesheet";
styles.type = "text/css";
styles.href = chrome.runtime.getURL("styles.css");
(document.head || document.documentElement).appendChild(styles);
