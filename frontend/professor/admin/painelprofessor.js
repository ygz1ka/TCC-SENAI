const logado = localStorage.getItem("logado");
const tipoUsuario = localStorage.getItem("tipoUsuario");

if (logado !== "true" || tipoUsuario !== "professor") {

    alert("Você não tem permissão para acessar esta página.");

    window.location.href = "../../escolha/index.html";

}