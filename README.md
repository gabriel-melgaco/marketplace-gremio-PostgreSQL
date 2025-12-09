# Projeto de Gerenciamento de Estoque e Vendas

Este projeto foi desenvolvido utilizando Flask, com integração ao PostgreSQL e funcionalidades de bot Telegram para notificações automáticas. A aplicação permite o cadastro de pessoal, produtos, vendas e compras, além de oferecer uma interface para administração e controle de estoque.

## Funcionalidades

- **Login de Administrador**: Controle de acesso com autenticação utilizando Flask-Login
- **Cadastro de Pessoal**: Permite o cadastro de pessoal com nome, posto, telefone e chat_id para integração com o Telegram
- **Cadastro de Produtos**: Adição de produtos ao estoque com informações como categoria, unidade, tamanho, quantidade e preço de venda
- **Registro de Vendas e Compras**: Cadastro de vendas e compras, com atualizações automáticas no estoque
- **Integração com Telegram**: Bot Telegram que envia notificações ao pessoal cadastrado sobre compras realizadas em seu nome
- **Interface de Administração**: Visualização e manipulação de dados (produtos, vendas, compras e pessoal) via interface web

## Tecnologias Utilizadas

- **Flask**: Framework web para Python
- **Flask-Login**: Gerenciamento de sessões de login
- **Peewee**: ORM para interagir com o banco de dados
- **PostgreSQL**: Banco de dados relacional para armazenar os dados
- **Telegram Bot API**: Integração com Telegram para notificações
- **Docker & Docker Compose**: Containerização e orquestração da aplicação

## Instalação com Docker Compose

### Pré-requisitos

- Docker e Docker Compose instalados na máquina
- Token de bot do Telegram (obtenha com o [@BotFather](https://t.me/botfather))

### Passo a passo

#### 1. Clone o repositório


#### 2. Configure as variáveis de ambiente

Edite o arquivo `docker-compose.yml` e substitua os seguintes valores:

- `POSTGRES_PASSWORD`: Senha do banco de dados PostgreSQL
- `POSTGRES_DB`: Nome do banco de dados
- `POSTGRES_USER`: Usuário do PostgreSQL (padrão: postgres)
- `POSTGRES_USUARIO`: Usuário para conexão da aplicação
- `POSTGRES_SENHA`: Senha para conexão da aplicação
- `POSTGRES_NAME`: Nome do banco para a aplicação
- `SECRET_KEY`: Chave secreta do Flask (gere uma aleatória)
- `DATABASE_USUARIO`: Usuário do banco de dados
- `DATABASE_SENHA`: Senha do banco de dados
- `TELEGRAM_TOKEN`: Token do seu bot Telegram

#### 3. Arquivo docker-compose.yml

```
services:
sgs_db:
image: postgres:17
container_name: sgs_db
restart: unless-stopped
ports:
- "5432:5432"
environment:
POSTGRES_USER: postgres
POSTGRES_PASSWORD: "YOURPASSWORDHERE"
POSTGRES_DB: YOURDBNAMEHERE
volumes:
- postgres_data:/var/lib/postgresql/data
networks:
- sgs_network

sgs_web:
build: .
container_name: sgs_web
restart: always
ports:
- "5000:5000"
environment:
POSTGRES_HOST: sgs_db
POSTGRES_PORTA: 5432
POSTGRES_USUARIO: YOURUSERHERE
POSTGRES_SENHA: "YOURPASSWORDHERE"
POSTGRES_NAME: YOURNAMEHERE
SECRET_KEY: YOURPASSWORDHERE
DATABASE_USUARIO: YOURUSERHERE
DATABASE_SENHA: YOURPASSWORDHERE
TELEGRAM_TOKEN: "YOUR BOT TELEGRAM TOKEN HERE"
depends_on:
- sgs_db
networks:
- sgs_network

volumes:
postgres_data:

networks:
sgs_network:
driver: bridge

```

#### 4. Construa e inicie os containers


#### 5. Acesse a aplicação

A aplicação estará disponível em: [**http://localhost:5000**](http://localhost:5000)

O banco de dados PostgreSQL estará acessível em: **localhost:5432**

#### 6. Verificar os logs

docker-compose logs -f sgs_web


## Contribuições

Sinta-se à vontade para contribuir para o projeto! 


## Licença

Este projeto foi desenvolvido para fins de estudo e como uma aplicação funcional para gerenciar estoque e vendas.

## Autor

Gabriel Melgaço - [GitHub](https://github.com/gabriel-melgaco)

---

**Nota**: Este projeto está em constante desenvolvimento. Melhorias e novas funcionalidades podem ser adicionadas conforme a necessidade.
