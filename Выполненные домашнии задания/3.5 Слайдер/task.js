const slides = Array.from(document.querySelectorAll(".slider__item"));
const dots = Array.from(document.querySelectorAll(".slider__dot"));
const prevArrow = document.querySelector(".slider__arrow_prev");
const nextArrow = document.querySelector(".slider__arrow_next");

let currentIndex = slides.findIndex((slide) =>
  slide.classList.contains("slider__item_active")
);

if (currentIndex === -1) {
  currentIndex = 0;
}

// Управление слайдером
const showSlide = (index) => {
  slides[currentIndex].classList.remove("slider__item_active");

  if (dots[currentIndex]) {
    dots[currentIndex].classList.remove("slider__dot_active");
  }

  // Бесконечная навигация: с первого слайда на последний и обратно
  currentIndex = (index + slides.length) % slides.length;

  slides[currentIndex].classList.add("slider__item_active");

  if (dots[currentIndex]) {
    dots[currentIndex].classList.add("slider__dot_active");
  }
};

// Регистрация обработчиков
prevArrow.onclick = () => showSlide(currentIndex - 1);
nextArrow.onclick = () => showSlide(currentIndex + 1);

dots.forEach((dot, index) => {
  dot.onclick = () => showSlide(index);
});

showSlide(currentIndex);
