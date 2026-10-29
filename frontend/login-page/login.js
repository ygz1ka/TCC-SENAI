// Login real via API Node.js. Compartilhado por Aluno e Professor.
const formularioLogin=document.getElementById('form-login');
const campoUsuario=document.getElementById('usuario');
const campoSenha=document.getElementById('senha');
const checkboxLembrar=document.getElementById('lembrar');
const botaoMostrarSenha=document.getElementById('mostrar-senha');
const tipoLogin=document.body.dataset.tipoLogin || 'aluno';
const antigo=localStorage.getItem('usuarioLembrado');
if(antigo){campoUsuario.value=antigo;checkboxLembrar.checked=true;}
if(botaoMostrarSenha)botaoMostrarSenha.addEventListener('click',()=>{
  const mostrar=campoSenha.type==='password';
  campoSenha.type=mostrar?'text':'password';
  botaoMostrarSenha.innerHTML=mostrar?'<svg class="icone-svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3 21 21M10.6 5.1A10 10 0 0 1 12 5c6 0 10 7 10 7a16 16 0 0 1-3 3.6M6 6.1C3.4 8 2 12 2 12s4 7 10 7a10 10 0 0 0 4.5-1M10 10a3 3 0 0 0 4 4"/></svg>':'<svg class="icone-svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
  botaoMostrarSenha.setAttribute('aria-label',mostrar?'Ocultar senha':'Mostrar senha');
});
formularioLogin.addEventListener('submit',async(event)=>{
  event.preventDefault();
  const botao=formularioLogin.querySelector('[type=submit]');
  botao.disabled=true;botao.textContent='Entrando...';
  try{
    const response=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:campoUsuario.value.trim(),senha:campoSenha.value,tipo:tipoLogin})});
    const dados=await response.json();
    if(!response.ok)throw Error(dados.erro||'Erro no login');
    sessionStorage.setItem('token',dados.token);
    localStorage.setItem('logado','true');
    localStorage.setItem('tipoUsuario',dados.usuario.tipo);
    localStorage.setItem('nomeUsuario',dados.usuario.nome);
    if(checkboxLembrar.checked)localStorage.setItem('usuarioLembrado',dados.usuario.username);
    else localStorage.removeItem('usuarioLembrado');
    window.location.href=dados.usuario.tipo==='professor'?'../professor/admin/painelprofessor.html':'../paginainicio.html';
  }catch(error){alert(error.message+'\nVerifique se o servidor foi iniciado com npm start.');}
  finally{botao.disabled=false;botao.textContent='Entrar';}
});
