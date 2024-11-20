# Projeto de Gerenciamento de Estoque e Vendas

Este projeto foi desenvolvido utilizando o Flask, com a integração de banco de dados PostGre e funcionalidades de bot Telegram para notificações automáticas. A aplicação permite o cadastro de pessoal, produtos, vendas e compras, além de oferecer uma interface para administração e controle de estoque.

## Funcionalidades

- **Login de Administrador**: Controle de acesso com autenticação utilizando Flask-Login.
- **Cadastro de Pessoal**: Permite o cadastro de pessoal com nome, posto, telefone e chat_id para integração com o Telegram.
- **Cadastro de Produtos**: Adição de produtos ao estoque com informações como categoria, unidade, tamanho, quantidade e preço de venda.
- **Registro de Vendas e Compras**: Cadastro de vendas e compras, com atualizações automáticas no estoque.
- **Integração com Telegram**: Bot Telegram que envia notificações ao pessoal cadastrado sobre compras realizadas em seu nome.
- **Interface de Administração**: Visualização e manipulação de dados (produtos, vendas, compras e pessoal) via interface web.

## Instalação

### Pré-requisitos

- Python 3.8 ou superior
- Instalar as dependências do projeto:
  
  ```bash
  pip install -r requirements.txt
### As dependências incluem:

- Flask
- Flask-Login
- peewee
- openpyxl
- telebot
- werkzeug
- Configuração do Banco de Dados:
O projeto utiliza o banco de dados SQLite para armazenar informações de pessoal, produtos, compras e vendas. A tabela será criada automaticamente ao rodar o servidor Flask.

**Configuração do Telegram**
Você precisa de um bot no Telegram para enviar notificações. Crie um bot no Telegram com o BotFather e obtenha um TOKEN. Adicione o token ao arquivo .env:

**Você precisará criar as seguintes chaves no sistema**
- TELEGRAM_TOKEN=
- SECRET_KEY=
- DATABASE_USUARIO=
- DATABASE_SENHA=

**Rodando o Servidor**
Para rodar o servidor Flask, utilize o comando abaixo:
python app.py

Isso iniciará a aplicação na URL http://localhost:5000.

**Rodando o Bot Telegram**
O bot do Telegram será iniciado automaticamente, mas para garantir que ele funcione corretamente em paralelo com o servidor Flask, execute a função de polling de forma assíncrona, para que o bot receba e envie mensagens:

python app.py
O bot ficará ativo aguardando interações e enviando notificações de compras.

Endpoints
A aplicação possui os seguintes endpoints:

## Autenticação
POST /login: Realiza o login do administrador.
Dados: usuario, senha
POST /logout: Realiza o logout do administrador.

## Pessoal
<p>POST /cadastrar_pessoal: Cadastra um novo pessoal.
Dados: posto, nome, telefone, chat_id</p>
<p>GET /mostrar_pessoal: Exibe todos os pessoais cadastrados.</p>
<p>DELETE /remover_pessoal/<id>: Remove um pessoal pelo ID.</p>

## Produtos
<p>POST /cadastrar_produto: Cadastra um novo produto no estoque.
Dados: produto, tamanho, unidade, categoria, preco_venda, foto</p>
<p>GET /mostrar_produtos: Exibe todos os produtos cadastrados.</p>
<p>DELETE /remover_produto/<id>: Remove um produto pelo ID.</p>
<p>POST /alterar_estoque/<id>: Altera o preço de venda de um produto.</p>

## Compras
<p>POST /cadastrar_compra: Registra uma compra de um produto.
Dados: produto, preco_compra, quantidade, data</p>
<p>GET /mostrar_compras: Exibe todas as compras realizadas.</p>
<p>DELETE /remover_compra/<id>: Remove uma compra pelo ID.</p>

## Vendas
<p>POST /cadastrar_venda: Registra uma venda.</p>
Dados: nome, produtosSelecionados
<p>GET /mostrar_vendas: Exibe todas as vendas realizadas.</p>
<p>DELETE /remover_venda/<id>: Remove uma venda pelo ID.</p>

## Tecnologias Utilizadas
- Flask: Framework web para Python.
- Flask-Login: Gerenciamento de sessões de login.
- Peewee: ORM para interagir com o banco de dados SQLite.
- SQLite: Banco de dados para armazenar os dados.
- Telegram Bot API: Integração com Telegram para notificações.

Contribuições
Sinta-se à vontade para contribuir para o projeto! Faça um fork do repositório, faça suas modificações e envie um pull request.

Nota: Este projeto foi desenvolvido para fins de estudo e como uma aplicação funcional para gerenciar estoque e vendas. Melhorias e novas funcionalidades podem ser adicionadas conforme a necessidade.
