// Função Login
document.getElementById('submit').addEventListener('click', function(event) {

    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;

    fetch(`/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            usuario: usuario,
            senha: senha
        })
    })
    .then(response => response.json())
    .then(data => {
        const mensagemDiv = document.getElementById('mensagem');
        mensagemDiv.style.display = 'block'; 
        if (data.status === 'success') {
            console.log('Usuário Logado com sucesso!')
            window.location.href = "protected";
        } else {
            mensagemDiv.className = 'alert alert-danger';
            mensagemDiv.innerHTML = data.message || 'Usuário ou senha incorreto'; 
        }
    })
    .catch(error => {
        const mensagemDiv = document.getElementById('mensagem');
        mensagemDiv.style.display = 'block'; 
        mensagemDiv.className = 'alert alert-danger';
        mensagemDiv.innerHTML = 'Erro de rede ou servidor!';
    });
});

