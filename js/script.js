"use strict";
// Exclamação intermitente
function intermitente() {
  const interr = document.querySelector(".interr");
  if (interr) {
    intermitenteLight = () => {
      setInterval(() => {
        interr.classList.toggle("ativo");
      }, 1000);
    };
    intermitenteLight();
  }
}
intermitente();
