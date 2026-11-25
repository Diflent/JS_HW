const cart = document.querySelector(".cart");
const cartProducts = document.querySelector(".cart__products");
const storageKey = "cartProducts";
const animationSteps = 20;
const animationStepDelay = 15;

// Сохранение корзины в localStorage (повышенная сложность #3)
const saveCart = () => {
  const items = Array.from(cartProducts.querySelectorAll(".cart__product")).map(
    (item) => ({
      id: item.dataset.id,
      image: item.querySelector(".cart__product-image").src,
      count: Number(item.querySelector(".cart__product-count").textContent)
    })
  );

  localStorage.setItem(storageKey, JSON.stringify(items));
};

// Корзина показывается, только если в ней есть товары (повышенная сложность #1)
const updateCartVisibility = () => {
  cart.classList.toggle(
    "cart_active",
    cartProducts.querySelector(".cart__product") !== null
  );
};

const findCartProduct = (id) =>
  Array.from(cartProducts.querySelectorAll(".cart__product")).find(
    (item) => item.dataset.id === id
  );

const createCartProduct = (id, image, count) => {
  const item = document.createElement("div");
  item.className = "cart__product";
  item.dataset.id = id;
  item.innerHTML = `
    <img class="cart__product-image" src="${image}">
    <div class="cart__product-count">${count}</div>
    <div class="cart__product-remove" title="Удалить из корзины">&times;</div>
  `;

  item.querySelector(".cart__product-remove").addEventListener("click", () => {
    item.remove();
    updateCartVisibility();
    saveCart();
  });

  cartProducts.append(item);
  return item;
};

const addToCart = (id, image, count) => {
  let item = findCartProduct(id);

  if (item) {
    const countElement = item.querySelector(".cart__product-count");
    countElement.textContent = Number(countElement.textContent) + count;
  } else {
    item = createCartProduct(id, image, count);
  }

  updateCartVisibility();
  saveCart();
  return item;
};

// Перемещение копии изображения в корзину (повышенная сложность #2)
const animateToCart = (productImage, cartItem) => {
  const from = productImage.getBoundingClientRect();
  const to = cartItem.querySelector(".cart__product-image").getBoundingClientRect();
  const shadow = productImage.cloneNode();
  shadow.classList.add("product-shadow");
  shadow.style.left = from.left + window.scrollX + "px";
  shadow.style.top = from.top + window.scrollY + "px";
  document.body.append(shadow);

  const stepX = (to.left - from.left) / animationSteps;
  const stepY = (to.top - from.top) / animationSteps;
  let step = 0;

  const intervalId = setInterval(() => {
    step++;
    shadow.style.left = from.left + window.scrollX + stepX * step + "px";
    shadow.style.top = from.top + window.scrollY + stepY * step + "px";

    if (step === animationSteps) {
      clearInterval(intervalId);
      shadow.remove();
    }
  }, animationStepDelay);
};

Array.from(document.querySelectorAll(".product")).forEach((product) => {
  const quantityValue = product.querySelector(".product__quantity-value");
  const decButton = product.querySelector(".product__quantity-control_dec");
  const incButton = product.querySelector(".product__quantity-control_inc");
  const addButton = product.querySelector(".product__add");
  const productImage = product.querySelector(".product__image");

  decButton.addEventListener("click", () => {
    const value = Number(quantityValue.textContent);
    quantityValue.textContent = Math.max(1, value - 1);
  });

  incButton.addEventListener("click", () => {
    quantityValue.textContent = Number(quantityValue.textContent) + 1;
  });

  addButton.addEventListener("click", () => {
    const cartItem = addToCart(
      product.dataset.id,
      productImage.src,
      Number(quantityValue.textContent)
    );
    animateToCart(productImage, cartItem);
  });
});

// Восстановление корзины после перезагрузки страницы
const restoreCart = () => {
  let savedItems = [];

  try {
    savedItems = JSON.parse(localStorage.getItem(storageKey)) || [];
  } catch (error) {
    savedItems = [];
  }

  savedItems.forEach((item) => createCartProduct(item.id, item.image, item.count));
  updateCartVisibility();
};

restoreCart();
