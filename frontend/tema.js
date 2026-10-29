/* Tema unificado. Nao modifica login, links ou menus. */
(function () {
  'use strict';
  const raiz = document.documentElement;
  const botao = document.getElementById('tema');
  const icone = document.getElementById('icone-tema');
  const pastaImagens = new URL('./imagens/', document.currentScript.src);
  function aplicarTema(valor) {
    const tema = valor === 'escuro' ? 'escuro' : 'claro';
    const escuro = tema === 'escuro';
    raiz.dataset.tema = tema;
    raiz.classList.toggle('dark', escuro);
    document.body.classList.toggle('dark', escuro);
    raiz.style.colorScheme = escuro ? 'dark' : 'light';
    if (icone) {
      icone.src = new URL(escuro ? 'sun.png' : 'moon.png', pastaImagens).href;
      icone.alt = escuro ? 'Ativar tema claro' : 'Ativar tema escuro';
    }
    try { localStorage.setItem('tema', tema); } catch (_) {}
  }
  let inicial = raiz.dataset.tema || 'claro';
  try { inicial = localStorage.getItem('tema') === 'escuro' ? 'escuro' : 'claro'; } catch (_) {}
  aplicarTema(inicial);
  if (botao) {
    botao.type = 'button';
    botao.addEventListener('click', function (evento) {
      evento.preventDefault();
      aplicarTema(raiz.dataset.tema === 'escuro' ? 'claro' : 'escuro');
    });
  }
  window.aplicarTemaSENAI = aplicarTema;
})();
