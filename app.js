const btn = document.querySelector("button");

if (btn) {
  btn.addEventListener("click", () => {
    const oldText = btn.textContent;
    btn.textContent = "WOW!";
    
    setTimeout(() => (btn.textContent = oldText), 1000);
  });
}