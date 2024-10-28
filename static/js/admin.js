
document.addEventListener("DOMContentLoaded", function () {
    mostrarPessoal();
    mostrarProdutos();
    mostrarListaCompras();
});

// --------------------------------------------------- INÍCIO FUNÇÕES PESSOAL-------------------------------------------------------
// Função Cadastrar Pessoal
document.getElementById('cadastrarPessoal').addEventListener('submit', function(event) {
    event.preventDefault();

    const posto = document.getElementById('posto').value;
    const nome = document.getElementById('nome').value.toUpperCase(); // Converter nome para maiúsculas
    const telefone = document.getElementById('telefone').value;

    fetch(`/cadastrar_pessoal`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            posto: posto,
            nome: nome,
            telefone: telefone
        })
    })
    .then(response => response.json())
    .then(data => {
        const mensagemDiv = document.getElementById('mensagem');
        mensagemDiv.style.display = 'block'; 
        if (data.status === 'success') {
            mensagemDiv.className = 'alert alert-success'; 
            mensagemDiv.innerHTML = 'Pessoa cadastrada com sucesso!';
            document.getElementById('cadastrarPessoal').reset();
            mostrarPessoal(); 
        } else {
            mensagemDiv.className = 'alert alert-danger';
            mensagemDiv.innerHTML = data.message || 'Erro ao cadastrar a pessoa!'; 
        }
    })
    .catch(error => {
        const mensagemDiv = document.getElementById('mensagem');
        mensagemDiv.style.display = 'block'; 
        mensagemDiv.className = 'alert alert-danger';
        mensagemDiv.innerHTML = 'Erro de rede ou servidor!';
    });
});


//Função Mostrar Pessoal
function mostrarPessoal() {
    fetch('/mostrar_pessoal')
        .then(response => response.json())
        .then(data => {
            const tabelaPessoal = document.getElementById('tabelaPessoal').getElementsByTagName('tbody')[0];
            tabelaPessoal.innerHTML = '';

            data.forEach(pessoal => {
                const novaLinha = document.createElement('tr');
                novaLinha.innerHTML = `
                    <td>${pessoal.id}</td>
                    <td>${pessoal.posto}</td>
                    <td>${pessoal.nome}</td>
                    <td>${pessoal.telefone}</td>
                    <td class="align-middle">
                        <a href="#!" data-mdb-tooltip-init title="Remove" onclick="removerPessoal(${pessoal.id})">
                            <i class="fas fa-trash-alt fa-lg text-warning"></i>
                        </a>
                    </td>
                `;
                tabelaPessoal.appendChild(novaLinha);
            });
        })
        .catch(error => console.error('Erro ao carregas a lista de pessoal', error));
}

//Função Remover pessoal
function removerPessoal(id){
    const confirmacao = confirm("Tem certeza que deseja excluir essa pessoa? Esta ação pode afetar a emissão correta de relatórios futuros");
    if (confirmacao) {
        fetch(`/remover_pessoal/${id}`, {method: 'DELETE'})
            .then(response => {
                if (response.ok) {
                    console.log(`Pessoa ${id} removida!`);
                    mostrarPessoal();  
                } else {
                    console.error('Erro ao remover Pessoal');
                }
            })
            .catch(error => console.error('Erro ao remover a pessoal:', error));
    } else {
        console.log("Exclusão cancelada pelo usuário");
    }
}

//------------------------------------------------------------FIM PESSOAL --------------------------------------------------------
//------------------------------------------------------------INÍCIO FUNÇÕES ESTOQUE/PRODUTOS ------------------------------------

//função cadastrar produto
document.getElementById('cadastrarProduto').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('produto', document.getElementById('produto').value);
    formData.append('tamanho', document.getElementById('tamanho').value);
    formData.append('unidade', document.getElementById('unidade').value);
    formData.append('categoria', document.getElementById('categoria').value);
    formData.append('preco_venda', document.getElementById('preco_venda').value);
    formData.append('foto', document.getElementById('foto').files[0]);  // Arquivo de foto

    fetch(`/cadastrar_produto`, {
        method: 'POST',
        body: formData 
    })
    .then(response => response.json())
    .then(data => {
        const mensagemDiv = document.getElementById('mensagem2');
        mensagemDiv.style.display = 'block'; 
        if (data.status === 'success') {
            mensagemDiv.className = 'alert alert-success'; 
            mensagemDiv.innerHTML = 'Produto cadastrado com sucesso!';
            document.getElementById('cadastrarProduto').reset();
            mostrarProdutos();
    
        } else {
            mensagemDiv.className = 'alert alert-danger';
            mensagemDiv.innerHTML = data.message || 'Erro ao cadastrar o Produto!'; 
        }
    })
    .catch(error => {
        const mensagemDiv = document.getElementById('mensagem');
        mensagemDiv.style.display = 'block'; 
        mensagemDiv.className = 'alert alert-danger';
        mensagemDiv.innerHTML = 'Erro de rede ou servidor!';
    });
});

//Função Mostrar Produtos
function mostrarProdutos() {
    fetch('/mostrar_produtos')
        .then(response => response.json())
        .then(data => {
            const tabelaEstoque = document.getElementById('tabelaEstoque').getElementsByTagName('tbody')[0];
            tabelaEstoque.innerHTML = '';

            data.forEach(produto => {
                const novaLinha = document.createElement('tr');
                novaLinha.innerHTML = `
                    <td>${produto.id}</td>
                    <td><img src="${produto.foto}" class="img-fluid rounded-3" style="width: 65px;"></td>
                    <td>${produto.produto}</td>
                    <td>${produto.tamanho}</td>
                    <td>${produto.unidade}</td>
                    <td>${produto.quantidade}</td>
                    <td>${produto.categoria}</td>
                    <td>${produto.preco_venda}</td>
                    <td>${produto.preco_compra}</td>
                    <td class="align-middle">
                        <a href="#!" data-mdb-tooltip-init title="Remove" onclick="removerProduto(${produto.id})">
                            <i class="fas fa-trash-alt fa-lg text-warning"></i>
                        </a>
                    </td>
                `;
                tabelaEstoque.appendChild(novaLinha);
            });
        })
        .catch(error => console.error('Erro ao carregar a lista de produtos', error));
}

//Função Remover pessoal
function removerProduto(id){
    const confirmacao = confirm("Tem certeza que deseja excluir esse Produto? Esta ação pode afetar a emissão correta de relatórios futuros");
    if (confirmacao) {
        fetch(`/remover_produto/${id}`, {method: 'DELETE'})
            .then(response => {
                if (response.ok) {
                    console.log(`Produto ${id} removido!`);
                    mostrarProdutos();  
                } else {
                    console.error('Erro ao remover Produto');
                }
            })
            .catch(error => console.error('Erro ao remover a Produto:', error));
    } else {
        console.log("Exclusão cancelada pelo usuário");
    }
}

//------------------------------------------- FIM FUNÇÕES PRODUTOS/ESTOQUE -------------------------------------------------
//--------------------------------------------INÍCIO FUNÇÕES COMPRAS ----------------------------------------
// Função para mostrar a lista de produtos
function mostrarListaCompras() {
    fetch('/mostrar_produtos')
        .then(response => response.json())
        .then(data => {
            const listaCompras = document.getElementById('listaProdutos'); // Obtém o elemento select
            listaCompras.innerHTML = ''; 

            data.forEach(produto => {
                const primeiraLinha = document.createElement('option');
                primeiraLinha.value = '';
                primeiraLinha.textContent = 'Selecione um produto';

                const novaLinha = document.createElement('option');
                novaLinha.value = produto.produto;
                novaLinha.textContent = `${produto.produto} ${produto.tamanho} ${produto.unidade}`;
                
                listaCompras.appendChild(primeiraLinha);
                listaCompras.appendChild(novaLinha);
            });
        })
        .catch(error => console.error('Erro ao carregar a lista de produtos no select:', error));
};

