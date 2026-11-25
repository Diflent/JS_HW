const defaultSpeed = 1000;

const applyColor = (rotatorCase) => {
  if (rotatorCase.dataset.color) {
    rotatorCase.style.color = rotatorCase.dataset.color;
  }
};

const startRotator = (rotator) => {
  const cases = Array.from(rotator.querySelectorAll(".rotator__case"));
  let activeIndex = cases.findIndex((item) =>
    item.classList.contains("rotator__case_active")
  );

  if (activeIndex === -1) {
    activeIndex = 0;
    cases[activeIndex].classList.add("rotator__case_active");
  }

  applyColor(cases[activeIndex]);

  const showNext = () => {
    cases[activeIndex].classList.remove("rotator__case_active");
    activeIndex = (activeIndex + 1) % cases.length;

    const activeCase = cases[activeIndex];
    activeCase.classList.add("rotator__case_active");
    applyColor(activeCase);

    setTimeout(showNext, Number(activeCase.dataset.speed) || defaultSpeed);
  };

  setTimeout(showNext, Number(cases[activeIndex].dataset.speed) || defaultSpeed);
};

Array.from(document.querySelectorAll(".rotator")).forEach(startRotator);
