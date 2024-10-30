
document.addEventListener("DOMContentLoaded", function () {
    mostrarPessoal();
    mostrarProdutos();
    mostrarListaCompras();
    mostrarCompras();
    mostrarVendas();
});

function formatarData(dataString) {
    // Cria um objeto Date a partir da string de data
    const data = new Date(dataString);
    
    // Extrai o dia, mês e ano
    const dia = String(data.getDate()).padStart(2, '0'); // Adiciona zero à esquerda se necessário
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // Meses começam do zero, então adicionamos 1
    const ano = data.getFullYear();

    // Retorna a data formatada como "DD/MM/YYYY"
    return `${ano}-${mes}-${dia}`;
}

function formatarHora(dataString) {
    // Cria um objeto Date a partir da string de hora
    const hora = new Date(dataString);
    
    // Extrai as horas, minutos e segundos
    const horas = String(hora.getHours()).padStart(2, '0');
    const minutos = String(hora.getMinutes()).padStart(2, '0'); 
    const segundos = String(hora.getSeconds()).padStart(2, '0'); 

    // Retorna a hora formatada
    return `${horas}:${minutos}:${segundos}`;
}

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
    formData.append('preco_venda', parseFloat(document.getElementById('preco_venda').value));
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
            mostrarListaCompras();
    
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
                    <td>R$ ${parseFloat(produto.preco_venda).toFixed(2)}</td>
                    <td>R$ ${parseFloat(produto.preco_compra).toFixed(2)}</td>
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

//Função Remover Produto
function removerProduto(id){
    const confirmacao = confirm("Tem certeza que deseja excluir esse Produto? Esta ação pode afetar a emissão correta de relatórios futuros");
    if (confirmacao) {
        fetch(`/remover_produto/${id}`, {method: 'DELETE'})
            .then(response => {
                if (response.ok) {
                    console.log(`Produto ${id} removido!`);
                    mostrarProdutos(); 
                    mostrarListaCompras();
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
// Função para mostrar a lista de produtos na área de compras
function mostrarListaCompras() {
    fetch('/mostrar_produtos')
        .then(response => response.json())
        .then(data => {
            const listaCompras = document.getElementById('listaProdutos'); // Obtém o elemento select
            listaCompras.innerHTML = '';
            const primeiraLinha = document.createElement('option');
                primeiraLinha.value = '';
                primeiraLinha.textContent = 'Selecione um produto';
                listaCompras.appendChild(primeiraLinha);

            data.forEach(produto => {

                const novaLinha = document.createElement('option');
                novaLinha.value = produto.produto;
                novaLinha.textContent = `${produto.produto} ${produto.tamanho} ${produto.unidade}`;
                

                listaCompras.appendChild(novaLinha);
            });
        })
        .catch(error => console.error('Erro ao carregar a lista de produtos no select:', error));
};

document.getElementById('botaoFiltrar').addEventListener('click', function() {
    filtrarLista();
});

document.getElementById('botaoLimpar').addEventListener('click', function() {
    const dataInicio = document.getElementById('dataInicio');
    const dataFim = document.getElementById('dataFim');
    
    dataInicio.value = '';
    dataFim.value = '';
    
    mostrarCompras();
});

function filtrarLista() {
    const dataInicioInput = document.getElementById('dataInicio').value;
    console.log(dataInicioInput)
    const dataFimInput = document.getElementById('dataFim').value;
    console.log(dataFimInput)

    // Converte as datas para objetos Date, se preenchidas
    const dataInicio = dataInicioInput ? new Date(dataInicioInput) : null;
    const dataFim = dataFimInput ? new Date(dataFimInput) : null;
    
    const tabelaCompras = document.getElementById('tabelaCompras').querySelector('tbody');

    Array.from(tabelaCompras.rows).forEach(row => {
        const dataProduto = new Date(row.cells[4].textContent.trim()); // Supondo que a data está na 5ª coluna (índice 4)
        
        // Se a data não for válida, ignora a linha
        if (isNaN(dataProduto)) return console.log('Data Inválida');

        
        // Filtra com base nas datas de início e fim
        const exibirLinha = (!dataInicio || dataProduto >= dataInicio) && 
                            (!dataFim || dataProduto <= dataFim);

        row.style.display = exibirLinha ? '' : 'none';
    });
}




//Função cadastrar compras
document.getElementById('cadastrarCompras').addEventListener('submit', function(event) {
    event.preventDefault();

    const produto = document.getElementById('listaProdutos').value;
    const preco_compra = parseFloat(document.getElementById('preco_compra').value);
    const quantidade = document.getElementById('quantidade').value;
    const data = document.getElementById('data').value;

    fetch(`/cadastrar_compra`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            produto: produto,
            preco_compra: preco_compra,
            quantidade: quantidade,
            data: data
        })
    })
    .then(response => response.json())
    .then(data => {
        const mensagemDiv = document.getElementById('mensagem3');
        mensagemDiv.style.display = 'block'; 
        if (data.status === 'success') {
            mensagemDiv.className = 'alert alert-success'; 
            mensagemDiv.innerHTML = 'Compra cadastrada com sucesso!';
            document.getElementById('cadastrarCompras').reset();
            mostrarCompras();
            mostrarProdutos(); 
        } else {
            mensagemDiv.className = 'alert alert-danger';
            mensagemDiv.innerHTML = data.message || 'Erro ao cadastrar a compra!'; 
        }
    })
    .catch(error => {
        const mensagemDiv = document.getElementById('mensagem');
        mensagemDiv.style.display = 'block'; 
        mensagemDiv.className = 'alert alert-danger';
        mensagemDiv.innerHTML = 'Erro de rede ou servidor!';
    });
});

//Função Mostrar Compras
function mostrarCompras() {
    fetch('/mostrar_compras')
        .then(response => response.json())
        .then(data => {
            const tabelaCompras = document.getElementById('tabelaCompras').getElementsByTagName('tbody')[0];
            tabelaCompras.innerHTML = '';

            data.forEach(compras => {
                const novaLinha = document.createElement('tr');
                novaLinha.innerHTML = `
                    <td>${compras.id}</td>
                    <td>${compras.produto}</td>
                    <td>${compras.quantidade}</td>
                    <td>R$ ${parseFloat(compras.preco_compra).toFixed(2)}</td>
                    <td>${formatarData(compras.data)}</td>
                    <td class="align-middle">
                        <a href="#!" data-mdb-tooltip-init title="Remove" onclick="removerCompras(${compras.id})">
                            <i class="fas fa-trash-alt fa-lg text-warning"></i>
                        </a>
                    </td>
                `;
                tabelaCompras.appendChild(novaLinha);
            });
        })
        .catch(error => console.error('Erro ao carregar a lista de compras', error));
}

//Função Remover Compras
function removerCompras(id){
    const confirmacao = confirm("Tem certeza que deseja excluir essa compra? Isso afetará os valores de quantidade em estoque!");
    if (confirmacao) {
        fetch(`/remover_compra/${id}`, {method: 'DELETE'})
            .then(response => {
                if (response.ok) {
                    console.log(`Compra ${id} removida!`);
                    mostrarCompras();
                    mostrarProdutos();
                } else {
                    console.error('Erro ao remover compra');
                }
            })
            .catch(error => console.error('Erro ao remover a compra:', error));
    } else {
        console.log("Exclusão cancelada pelo usuário");
    }
}

//--------------------------------------------FIM FUNÇÕES COMPRAS ----------------------------------------
// -------------------------------------------INÍCIO FUNÇÕES VENDAS -------------------------------------
//Função Mostrar Compras
function mostrarVendas() {
    fetch('/mostrar_vendas')
        .then(response => response.json())
        .then(data => {
            const tabelaVendas = document.getElementById('tabelaVendas').getElementsByTagName('tbody')[0];
            tabelaVendas.innerHTML = '';

            data.forEach(vendas => {
                const novaLinha = document.createElement('tr');
                novaLinha.innerHTML = `
                    <td>${vendas.id}</td>
                    <td>${vendas.nome}</td>
                    <td>${vendas.produto}</td>
                    <td>${vendas.quantidade}</td>
                    <td>R$ ${parseFloat(vendas.valor_total).toFixed(2)}</td>
                    <td>${formatarHora(vendas.hora)}</td>
                    <td>${formatarData(vendas.data)}</td>
                    <td class="align-middle">
                        <a href="#!" data-mdb-tooltip-init title="Remove" onclick="removerVendas(${vendas.id})">
                            <i class="fas fa-trash-alt fa-lg text-warning"></i>
                        </a>
                    </td>
                `;
                tabelaVendas.appendChild(novaLinha);
            });
        })
        .catch(error => console.error('Erro ao carregar a lista de vendas', error));
}

document.getElementById('botaoFiltrar2').addEventListener('click', function() {
    filtrarListaVendas();
});

document.getElementById('botaoLimpar2').addEventListener('click', function() {
    const dataInicio = document.getElementById('dataInicio2');
    const dataFim = document.getElementById('dataFim2');
    
    dataInicio.value = '';
    dataFim.value = '';
    
    mostrarVendas();
});

function filtrarListaVendas() {
    const dataInicioInput = document.getElementById('dataInicio2').value;
    console.log(dataInicioInput)
    const dataFimInput = document.getElementById('dataFim2').value;
    console.log(dataFimInput)

    // Converte as datas para objetos Date, se preenchidas
    const dataInicio = dataInicioInput ? new Date(dataInicioInput) : null;
    const dataFim = dataFimInput ? new Date(dataFimInput) : null;
    
    const tabelaVendas = document.getElementById('tabelaVendas').querySelector('tbody');

    Array.from(tabelaVendas.rows).forEach(row => {
        const dataProduto = new Date(row.cells[6].textContent.trim());
        
        // Se a data não for válida, ignora a linha
        if (isNaN(dataProduto)) return console.log('Data Inválida');

        
        // Filtra com base nas datas de início e fim
        const exibirLinha = (!dataInicio || dataProduto >= dataInicio) && 
                            (!dataFim || dataProduto <= dataFim);

        row.style.display = exibirLinha ? '' : 'none';
    });
}

//Função Remover Vendas
function removerVendas(id){
    const confirmacao = confirm("Tem certeza que deseja excluir essa venda? Isso afetará os valores de quantidade em estoque!");
    if (confirmacao) {
        fetch(`/remover_venda/${id}`, {method: 'DELETE'})
            .then(response => {
                if (response.ok) {
                    console.log(`Venda ${id} removida!`);
                    mostrarVendas();
                    mostrarProdutos();
                } else {
                    console.error('Erro ao remover venda');
                }
            })
            .catch(error => console.error('Erro ao remover a venda:', error));
    } else {
        console.log("Exclusão cancelada pelo usuário");
    }
}
// -------------------------------------------FIM FUNÇÕES VENDAS ---------------------------------------
//função emissão de relatório







//download de arquivos database
document.getElementById('downloadDatabase').addEventListener('click', function(event) {
    fetch(`/download_database`, {
    })
    .then(response => {
        if (response.ok) {
            return response.blob();
        } else {
            return response.json().then(data => { throw new Error(data.message); });
        }
    })
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dados.db';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        document.getElementById('downloadDatabase').reset();
    })
    .catch(error => console.error('Erro ao enviar dados:', error));
});