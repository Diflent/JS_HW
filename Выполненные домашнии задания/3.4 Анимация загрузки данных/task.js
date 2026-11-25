const coursesUrl = "https://students.netoservices.ru/nestjs-backend/slow-get-courses";
const storageKey = "currencyCourses";
const loader = document.getElementById("loader");
const items = document.getElementById("items");

const renderCourses = (valutes) => {
  items.innerHTML = Object.values(valutes)
    .map(
      (valute) => `
        <div class="item">
          <div class="item__code">${valute.CharCode}</div>
          <div class="item__value">${valute.Value}</div>
          <div class="item__currency">руб.</div>
        </div>
      `
    )
    .join("");
};

const getCachedCourses = () => {
  try {
    return JSON.parse(localStorage.getItem(storageKey));
  } catch (error) {
    return null;
  }
};

// Повышенная сложность: сразу показываем данные прошлого запроса
const cachedCourses = getCachedCourses();

if (cachedCourses) {
  renderCourses(cachedCourses);
  loader.classList.remove("loader_active");
}

const xhr = new XMLHttpRequest();
xhr.open("GET", coursesUrl);
xhr.responseType = "json";

xhr.addEventListener("load", () => {
  loader.classList.remove("loader_active");

  if (xhr.status !== 200 || !xhr.response) {
    return;
  }

  const valutes = xhr.response.response.Valute;
  renderCourses(valutes);
  localStorage.setItem(storageKey, JSON.stringify(valutes));
});

xhr.addEventListener("error", () => {
  loader.classList.remove("loader_active");
});

xhr.send();
