window.addEventListener("DOMContentLoaded", () => {
  // DOM ready! Images, frames, and other sub-resources are still downloading.
  const apiKeyInput = document.getElementById("apiKey");
  const saveApiKeyButton = document.getElementById("saveApiKeyButton");
  const deleteApiKeyButton = document.getElementById("deleteApiKeyButton");

  const cachedApiKey = localStorage.getItem("apiKey");
  if (cachedApiKey) {
    apiKeyInput.value = cachedApiKey;
  }

  saveApiKeyButton.addEventListener("click", () => {
    const apiKey = apiKeyInput.value;
    saveApiKey(apiKey);
  });

  deleteApiKeyButton.addEventListener("click", () => {
    apiKeyInput.value = "";
    saveApiKey("");
  });
});
