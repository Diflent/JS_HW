const menuLinks = Array.from(document.querySelectorAll(".menu__link"));

menuLinks.forEach((link) => {
  link.onclick = () => {
    const subMenu = link.closest(".menu__item").querySelector(".menu_sub");

    if (!subMenu) {
      return;
    }

    // Повышенная сложность: в пределах одного навигационного меню
    // одновременно открыто не более одного подменю
    const mainMenu = link.closest(".menu_main");
    const activeMenus = Array.from(mainMenu.querySelectorAll(".menu_active"));

    activeMenus.forEach((menu) => {
      if (menu !== subMenu) {
        menu.classList.remove("menu_active");
      }
    });

    subMenu.classList.toggle("menu_active");
    return false;
  };
});
