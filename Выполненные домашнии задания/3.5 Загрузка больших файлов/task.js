const form = document.getElementById("form");
const progress = document.getElementById("progress");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const xhr = new XMLHttpRequest();

  xhr.upload.addEventListener("progress", (progressEvent) => {
    if (progressEvent.lengthComputable) {
      progress.value = progressEvent.loaded / progressEvent.total;
    }
  });

  xhr.upload.addEventListener("load", () => {
    progress.value = 1;
  });

  xhr.addEventListener("load", () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      alert("Файл успешно загружен");
    } else {
      alert("Ошибка загрузки: " + xhr.status);
    }
  });

  xhr.addEventListener("error", () => {
    alert("Не удалось отправить файл");
  });

  progress.value = 0;
  xhr.open("POST", form.action);
  xhr.send(new FormData(form));
});
