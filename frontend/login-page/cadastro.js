const form=document.getElementById('form-cadastro');
const tipo=document.getElementById('tipo');
const parametros=new URLSearchParams(location.search);
tipo.value=parametros.get('tipo')==='professor'?'professor':'aluno';
const voltar=document.getElementById('voltar-login');
function atualizarVoltar(){voltar.href=tipo.value==='professor'?'loginpage.html':'loginaluno.html';}
tipo.addEventListener('change',atualizarVoltar);atualizarVoltar();
const senha=document.getElementById('senha');
document.getElementById('mostrar-senha').addEventListener('click',()=>{senha.type=senha.type==='password'?'text':'password';});
form.addEventListener('submit',async(e)=>{
  e.preventDefault();const botao=form.querySelector('[type=submit]'),mensagem=document.getElementById('mensagem-cadastro');
  botao.disabled=true;botao.textContent='Cadastrando...';mensagem.textContent='';
  const dados={nome:document.getElementById('nome').value.trim(),sobrenome:document.getElementById('sobrenome').value.trim(),username:document.getElementById('username').value.trim(),senha:senha.value,tipo:tipo.value};
  try{
    const resposta=await fetch('/api/cadastro',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(dados)});
    const json=await resposta.json();if(!resposta.ok)throw Error(json.erro||'Erro no cadastro');
    alert('Cadastro realizado com sucesso! Entre com seu username e senha.');
    location.href=voltar.href;
  }catch(err){mensagem.textContent=err.message+' Verifique se executou npm start.';}
  finally{botao.disabled=false;botao.textContent='Cadastrar';}
});
