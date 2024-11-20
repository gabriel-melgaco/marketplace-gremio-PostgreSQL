document.addEventListener("DOMContentLoaded", function () {
    mostrarListaPessoal();
    mostrarProdutos();
});

function scrollToFooter() {
    document.getElementById('footer').scrollIntoView({ behavior: 'smooth' });
}

// Função para exibir produtos no carrinho
function mostrarProdutos() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    // Exibe o spinner antes de iniciar o fetch
    loadingSpinner.style.display = 'flex';

    fetch('/mostrar_produtos')
        .then(response => response.json())
        .then(data => {
            const containerList = document.getElementById('containerList');
            containerList.innerHTML = '';

            data.forEach(produto => {
                const novaLinha = document.createElement('div');
                novaLinha.innerHTML = `
                <section id="${produto.categoria}">
                <div class="card mb-3 shadow">
                    <div class="card-body">
                          <div class="d-flex justify-content-between">
                              <div class="d-flex flex-row align-items-center">
                                  <div>
                                      <img
                                          src="${produto.foto}"
                                          class="img-fluid rounded-3" alt="Shopping item" style="width: 65px;">
                                  </div>
                                  <div class="ms-3">
                                      <h5>${produto.produto}</h5> <p>${produto.tamanho} ${produto.unidade}</p>
                                  </div>
                              </div>
                              <div class="d-flex flex-row align-items-center">
                                  <button class="btn btn-link px-2"
                                          onclick="this.parentNode.querySelector('input[type=number]').stepDown(); calcularTotal();">
                                      <i class="fas fa-minus"></i>
                                  </button>

                                  <input min="0" name="quantity" value="0" type="number"
                                         class="form-control form-control-sm w-50" style="max-width: 50px;" 
                                         onchange="calcularTotal()" />

                                  <button class="btn btn-link px-2"
                                          onclick="this.parentNode.querySelector('input[type=number]').stepUp(); calcularTotal();">
                                      <i class="fas fa-plus"></i>
                                  </button>

                                  <div style="width: 80px;">
                                      <h5 class="mb-0">R$${produto.preco_venda.toFixed(2).replace('.',',')}</h5>
                                  </div>
                              </div>
                          </div>
                      </div>
                </div>
                </section>
                `;
                containerList.appendChild(novaLinha);
            });

            // Chama calcularTotal uma vez após a lista de produtos ser carregada
            calcularTotal();
        })
        .catch(error => console.error('Erro ao carregar a lista de produtos', error))
        .finally(() => {
            // Esconde o spinner após o carregamento ou erro
            loadingSpinner.style.display = 'none';
        });
}

// Função para exibir lista pessoal
function mostrarListaPessoal() {
    fetch('/mostrar_pessoal')
        .then(response => response.json())
        .then(data => {
            const listaPessoal = document.getElementById('listaPessoal');
            listaPessoal.innerHTML = '';
            const primeiraLinha = document.createElement('option');
            primeiraLinha.value = '';
            primeiraLinha.textContent = 'Selecione uma conta';
            listaPessoal.appendChild(primeiraLinha);

            data.forEach(pessoal => {
                const novaLinha = document.createElement('option');
                novaLinha.value = pessoal.nome;
                novaLinha.setAttribute('data-id', pessoal.id);
                novaLinha.textContent = `${pessoal.posto} ${pessoal.nome}`;
                listaPessoal.appendChild(novaLinha);
            });
        })
        .catch(error => console.error('Erro ao carregar a lista de pessoas no select:', error));
}

// Função para calcular o total e capturar produtos selecionados
function calcularTotal() {
    const containerList = document.getElementById('containerList');
    const items = containerList.querySelectorAll('.card-body');
    let total = 0;
    const produtosSelecionados = [];

    items.forEach(item => {
        const quantidade = parseInt(item.querySelector('input[type=number]').value) || 0;
        const preco = parseFloat(item.querySelector('.mb-0').textContent.replace('R$', '').replace(',', '.'));
        const nomeProduto = item.querySelector('h5').textContent;

        if (quantidade > 0) { 
            total += quantidade * preco;

            produtosSelecionados.push({
                produto: nomeProduto,
                quantidade: quantidade,
                preco: preco,
                preco_total: quantidade * preco
            });
        }
    });

    // Atualiza o valor total na página
    document.querySelector('.total').textContent = `R$${total.toFixed(2).replace('.',',')}`;
    document.querySelector('.totalValor').textContent = `R$${total.toFixed(2).replace('.',',')}`;

    // Retorna o array com os produtos selecionados e o total
    return {
        total: total,
        produtosSelecionados: produtosSelecionados
    };
}

// Função para mostrar o modal e confirmar a venda
document.getElementById('submit').addEventListener('click', function(event) {
    event.preventDefault();

    const nome = document.getElementById('listaPessoal').value.trim(); // Remove espaços em branco
    const resultado = calcularTotal();
    const total = resultado.total;
    const produtosSelecionados = resultado.produtosSelecionados;

    // Verifica se o nome está vazio
    if (!nome) {
        alert("Por favor, informe o seu nome antes de finalizar a compra.");
        return; // Interrompe a execução se o nome estiver vazio
    }

    // Verifica se pelo menos um item foi selecionado
    if (produtosSelecionados.length === 0) {
        alert("Por favor, selecione pelo menos 1 item antes de finalizar a compra.");
        return; // Interrompe a execução se não houver produtos selecionados
    }

    const detalhesConfirmacao = document.getElementById('modal-body');
    detalhesConfirmacao.innerHTML = ''; // Limpa o conteúdo anterior para evitar duplicação

    // Adiciona mensagem de confirmação uma única vez
    const mensagemConfirmacao = document.createElement('p');
    mensagemConfirmacao.textContent = `${nome}, você confirma a compra dos seguintes produtos?`;
    detalhesConfirmacao.appendChild(mensagemConfirmacao);

    // Lista os produtos selecionados e as quantidades
    produtosSelecionados.forEach(produto => {
        const novaLinha = document.createElement('p');
        novaLinha.textContent = `${produto.quantidade} x ${produto.produto}`;
        detalhesConfirmacao.appendChild(novaLinha);
    });

    // Adiciona o total
    const totalElemento = document.createElement('h5');
    totalElemento.textContent = `Total de: R$${total.toFixed(2)}`;
    detalhesConfirmacao.appendChild(totalElemento);

    // Exibe o modal de confirmação com detalhes da compra
    const modal = new bootstrap.Modal(document.getElementById('detalhesConfirmacao'));
    modal.show();

    // Adiciona um listener para quando o modal for cancelado
    document.getElementById('cancelar').addEventListener('click', function() {
        modal.hide();
    }, { once: true }); 

    // Adiciona um listener para quando o modal for confirmado
    document.getElementById('confirmar').addEventListener('click', function() {
        // Envia a requisição para cadastrar a venda
        fetch(`/cadastrar_venda`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: nome,
                produtosSelecionados: produtosSelecionados
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                console.log('Venda criada com sucesso!');
                modal.hide();
                window.location.href = "sucesso";
            } else {
                console.error('Erro ao criar a venda:', data.message);
                window.location.href = "error";
            }
        })
        .catch(error => console.error('Erro ao cadastrar a venda:', error));
    }, { once: true });
});


// função para rolar até o elemento
function rolarParaCategoria(categoria) {
    const elemento = document.getElementById(categoria);
    if (elemento) {
        elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}




    

    