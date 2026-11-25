const editor = document.getElementById("editor");
const clearButton = document.getElementById("clear");
const storageKey = "editorText";

editor.value = localStorage.getItem(storageKey) || "";

editor.addEventListener("input", () => {
  localStorage.setItem(storageKey, editor.value);
});

clearButton.addEventListener("click", () => {
  editor.value = "";
  localStorage.removeItem(storageKey);
  editor.focus();
});
