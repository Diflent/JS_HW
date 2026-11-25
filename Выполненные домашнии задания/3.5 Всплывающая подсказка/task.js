const tooltip = document.createElement("div");
tooltip.className = "tooltip";
document.body.append(tooltip);

let currentTarget = null;
const gap = 5;

const hideTooltip = () => {
  tooltip.classList.remove("tooltip_active");
  currentTarget = null;
};

const placeTooltip = (element) => {
  const targetRect = element.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  let left = targetRect.left;
  let top = targetRect.bottom + gap;

  switch (element.dataset.position) {
    case "top":
      top = targetRect.top - tooltipRect.height - gap;
      break;
    case "left":
      left = targetRect.left - tooltipRect.width - gap;
      top = targetRect.top;
      break;
    case "right":
      left = targetRect.right + gap;
      top = targetRect.top;
      break;
  }

  tooltip.style.left = left + "px";
  tooltip.style.top = top + "px";
};

const showTooltip = (element) => {
  tooltip.textContent = element.title;
  tooltip.classList.add("tooltip_active");
  placeTooltip(element);
  currentTarget = element;
};

Array.from(document.querySelectorAll(".has-tooltip")).forEach((element) => {
  element.addEventListener("click", (event) => {
    event.preventDefault();

    // Повторный клик по той же ссылке скрывает подсказку,
    // клик по другой — переносит единственную подсказку к ней
    if (currentTarget === element) {
      hideTooltip();
    } else {
      showTooltip(element);
    }
  });
});

// Подсказка позиционируется fixed, поэтому при прокрутке прячем её
window.addEventListener("scroll", hideTooltip);
