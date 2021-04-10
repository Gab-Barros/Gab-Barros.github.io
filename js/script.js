// Exclamação intermitente
function intermitente() {
  const interr = document.querySelector(".interr");
  if (interr) {
    function intermitenteLight() {
      setInterval(() => {
        interr.classList.toggle("ativo");
      }, 1000);
    }
    intermitenteLight();
  }
}
intermitente();

// Fade intro ao carregar
function fadeInDown() {
  const elements = document.querySelectorAll("[data-fade]");
  window.addEventListener("load", fadeElements);
  function fadeElements() {
    elements.forEach((element) => {
      element.classList.add("active");
    });
  }
}
fadeInDown();
