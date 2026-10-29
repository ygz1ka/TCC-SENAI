document.querySelectorAll(".opcao-acesso").forEach(function (opcao) {
  opcao.addEventListener("click", function () {
    const tipo = opcao.getAttribute("data-tipo");
    if (tipo === "aluno") window.location.href = "../login-page/loginaluno.html";
    if (tipo === "professor") window.location.href = "../login-page/loginpage.html";
  });
});
