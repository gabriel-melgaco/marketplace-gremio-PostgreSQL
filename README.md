# Projeto de Gerenciamento de Estoque e Vendas

Este projeto foi desenvolvido utilizando o Flask, com a integração de banco de dados SQLite e funcionalidades de bot Telegram para notificações automáticas. A aplicação permite o cadastro de pessoal, produtos, vendas e compras, além de oferecer uma interface para administração e controle de estoque.

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
As dependências incluem:

Flask
Flask-Login
peewee
openpyxl
telebot
werkzeug
Configuração do Banco de Dados
O projeto utiliza o banco de dados SQLite para armazenar informações de pessoal, produtos, compras e vendas. A tabela será criada automaticamente ao rodar o servidor Flask.

Configuração do Telegram
Você precisa de um bot no Telegram para enviar notificações. Crie um bot no Telegram com o BotFather e obtenha um TOKEN. Adicione o token ao arquivo .env:

env
Copiar código
TELEGRAM_TOKEN=<Seu Token do Bot Telegram>
SECRET_KEY=<Sua chave secreta do Flask>
DATABASE_USUARIO=<Usuário do banco de dados>
DATABASE_SENHA=<Senha do banco de dados>
Rodando o Servidor
Para rodar o servidor Flask, utilize o comando abaixo:

bash
Copiar código
python app.py
Isso iniciará a aplicação na URL http://localhost:5000.

Rodando o Bot Telegram
O bot do Telegram será iniciado automaticamente, mas para garantir que ele funcione corretamente em paralelo com o servidor Flask, execute a função de polling de forma assíncrona, para que o bot receba e envie mensagens:

bash
Copiar código
python app.py
O bot ficará ativo aguardando interações e enviando notificações de compras.

Endpoints
A aplicação possui os seguintes endpoints:

## Autenticação
POST /login: Realiza o login do administrador.
Dados: usuario, senha
POST /logout: Realiza o logout do administrador.

## Pessoal
POST /cadastrar_pessoal: Cadastra um novo pessoal.
Dados: posto, nome, telefone, chat_id
GET /mostrar_pessoal: Exibe todos os pessoais cadastrados.
DELETE /remover_pessoal/<id>: Remove um pessoal pelo ID.

## Produtos
POST /cadastrar_produto: Cadastra um novo produto no estoque.
Dados: produto, tamanho, unidade, categoria, preco_venda, foto
GET /mostrar_produtos: Exibe todos os produtos cadastrados.
DELETE /remover_produto/<id>: Remove um produto pelo ID.
POST /alterar_estoque/<id>: Altera o preço de venda de um produto.

## Compras
POST /cadastrar_compra: Registra uma compra de um produto.
Dados: produto, preco_compra, quantidade, data
GET /mostrar_compras: Exibe todas as compras realizadas.
DELETE /remover_compra/<id>: Remove uma compra pelo ID.

## Vendas
POST /cadastrar_venda: Registra uma venda.
Dados: nome, produtosSelecionados
GET /mostrar_vendas: Exibe todas as vendas realizadas.
DELETE /remover_venda/<id>: Remove uma venda pelo ID.

## Tecnologias Utilizadas
- Flask: Framework web para Python.
- Flask-Login: Gerenciamento de sessões de login.
- Peewee: ORM para interagir com o banco de dados SQLite.
- SQLite: Banco de dados para armazenar os dados.
- Telegram Bot API: Integração com Telegram para notificações.

Contribuições
Sinta-se à vontade para contribuir para o projeto! Faça um fork do repositório, faça suas modificações e envie um pull request.

Nota: Este projeto foi desenvolvido para fins de estudo e como uma aplicação funcional para gerenciar estoque e vendas. Melhorias e novas funcionalidades podem ser adicionadas conforme a necessidade.
