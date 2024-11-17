from flask import Flask, render_template, request, jsonify, send_from_directory, send_file
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user
from peewee import *
from datetime import datetime as dt
import datetime
import os
from werkzeug.utils import secure_filename
import unicodedata
import re
from openpyxl import Workbook



app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/img'
UPLOAD_FOLDER_DB = os.path.dirname(os.path.abspath(__file__))
app.config['UPLOAD_FOLDER_DB'] = UPLOAD_FOLDER_DB
app.secret_key = '123' #os.getenv('SECRET_KEY')
app.config['usuario'] = 'admin' #os.getenv('DATABASE_USUARIO')
app.config['senha'] = 'brasil123' #os.getenv('DATABASE_SENHA')




#-------------LOGIN MANAGER ---------------------------------------
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'pagina_login'

#-------------CLASSES BANCO DE DADOS ------------------------------
db = SqliteDatabase('dados.db')
class Pessoal(Model):
    id = IntegerField(primary_key=True, unique=True)
    posto = CharField()
    nome = CharField(unique=True)
    telefone = IntegerField(null=True)
    chat_id = IntegerField(null=True)

    class Meta:
        database = db
        db_table = 'pessoal'

# Modelo da tabela "estoque"
class Estoque(Model):
    id = IntegerField(primary_key=True, unique=True)
    produto = CharField(unique=True)
    tamanho = IntegerField(null=True)
    categoria = CharField()
    unidade = CharField()
    quantidade = IntegerField(null=True)
    preco_venda = FloatField()
    preco_compra = FloatField(null=True)
    foto = CharField(null=True)

    class Meta:
        database = db
        db_table = 'estoque'


class Venda(Model):
    id = IntegerField(primary_key=True, unique=True)
    nome = ForeignKeyField(Pessoal, field='nome', on_update='CASCADE', on_delete='CASCADE')
    produto = ForeignKeyField(Estoque, field='produto', on_update='CASCADE', on_delete='CASCADE')
    quantidade = IntegerField()
    valor_total = FloatField()
    hora = DateTimeField(default=datetime.datetime.now)
    data = DateField(default=datetime.date.today)

    class Meta:
        database = db
        db_table = 'venda'

class Compra(Model):
    id = IntegerField(primary_key=True, unique=True)
    produto = ForeignKeyField(Estoque, field='produto', on_update='CASCADE', on_delete='CASCADE')
    preco_compra = FloatField()
    quantidade = IntegerField()
    data = DateField()

    class Meta:
        database = db
        db_table = 'compra'


class User(UserMixin):
    def __init__(self, id):
        self.id = id


db.connect()
db.create_tables([Pessoal, Estoque, Venda, Compra])
#--------------------- FIM CLASSES BANCO DE DADOS --------------------



# ---------------------RENDERIZAÇÃO DE PÁGINAS -----------------------
@app.route("/")
def index():
    return render_template('index.html')

@login_manager.user_loader
def load_user(user_id):
    return User(user_id) if user_id == app.config['usuario'] else None

@app.route("/pagina_login")
def pagina_login():
    return render_template('login.html')

@app.route("/protected")
@login_required
def protected():
    return render_template('admin.html')

@app.route("/sucesso")
def sucesso():
    return render_template('sucesso.html')

@app.route("/error")
def error():
    return render_template('error.html')
# ---------------------FIM DE RENDERIZAÇÃO DE PÁGINAS -----------------------
@app.route("/login", methods=['POST'])
def login():
    data = request.json
    usuario = data.get('usuario')
    senha = data.get('senha')

    if usuario == app.config['usuario'] and senha == app.config['senha']:
        user = User(id=usuario)
        login_user(user)
        return jsonify({"status": "success", "message": "Usuário logado com sucesso"})

    return jsonify({"status": "error", "message": "Credenciais inválidas"}), 401

@app.route("/logout", methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({"status": "success", "message": "Usuário deslogado com sucesso"})

# ---------------------FUNÇÕES MANIPULAÇÃO DE BANCO DE DADOS -----------------------
@app.route('/cadastrar_pessoal', methods=['POST'])
def cadastrar_pessoal():
    data = request.json
    posto = data.get('posto')
    nome = data.get('nome')
    telefone = data.get('telefone')
    chat_id = data.get('chat_id')

    try:

        Pessoal.create(posto=posto, nome=nome, telefone=telefone, chat_id=chat_id)
        return jsonify({"status": "success"}), 200

    except IntegrityError as e:
        return jsonify({"status": "error", "message": "Erro ao cadastrar pessoa. Parece já estar no Banco de Dados"}), 400


@app.route('/mostrar_pessoal')
def mostrar_pessoal():
    pessoal = Pessoal.select()
    lista_pessoal =[]

    for pessoais in pessoal:
        lista_pessoal.append({
            'id': pessoais.id,
            'posto': pessoais.posto,
            'nome': pessoais.nome,
            'telefone': pessoais.telefone,
            'chat_id' : pessoais.chat_id
        })
    return jsonify(lista_pessoal)

@app.route('/remover_pessoal/<int:id>', methods=['DELETE'])
def remover_pessoal(id):
    try:
        pessoal = Pessoal.get_or_none(Pessoal.id == id)

        if pessoal:
            pessoal.delete_instance()
            return jsonify({'message': 'Militar removido com sucesso!'}), 200
        else:
            return jsonify({'error': 'Militar não encontrada!'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500




@app.route('/cadastrar_produto', methods=['POST'])
def cadastrar_produto():
    def tratar_string(s):
        # Remove acentos
        s = unicodedata.normalize('NFD', s)
        s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
        # Remove espaços
        s = re.sub(r'[^a-zA-Z0-9]', '', s)  # Remove tudo que não for letra ou número
        return s

    produto = request.form.get('produto')
    tamanho = request.form.get('tamanho')
    unidade = request.form.get('unidade')
    quantidade = 0
    categoria = request.form.get('categoria')
    preco_venda = float(request.form.get('preco_venda'))
    preco_compra = 0
    foto = f'static/img/{tratar_string(produto)}.png' # o que vai ser salvo no banco de dados
    foto_salva = request.files.get('foto') # a que vai ser salva na pasta /static/img

    # Validações básicas
    if not all([produto, tamanho, unidade, categoria, preco_venda, foto_salva]):
        return jsonify({'status': 'error', 'message': 'Todos os campos são obrigatórios'}), 400

    # Salva no banco de dados
    try:
        Estoque.create(produto=produto, tamanho=tamanho, unidade=unidade, categoria=categoria, preco_venda=preco_venda, foto=foto, quantidade=quantidade, preco_compra=preco_compra)
    except IntegrityError as e:
        return jsonify({'status': 'error', 'message': f'Parece que este produto já está cadastrado com esse nome: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'status': 'error', 'message': f'Erro ao salvar no banco de dados: {str(e)}'}), 500

    # Processa o arquivo de imagem
    try:
        filename = f"{secure_filename(tratar_string(produto))}.png"
        foto_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        foto_salva.save(foto_path)
    except Exception as e:
        return jsonify({'status': 'error', 'message': f'Erro ao salvar imagem: {str(e)}'}), 500

    return jsonify({'status': 'success', 'message': 'Produto cadastrado com sucesso!'})

@app.route('/mostrar_produtos')
def mostrar_produtos():
    estoque = Estoque.select().order_by(Estoque.categoria.asc(), Estoque.produto.asc())
    lista_estoque =[]

    for produto in estoque:
        lista_estoque.append({
            'id': produto.id,
            'foto': produto.foto,
            'produto': produto.produto,
            'tamanho': produto.tamanho,
            'unidade': produto.unidade,
            'quantidade': produto.quantidade,
            'categoria': produto.categoria,
            'preco_venda': produto.preco_venda,
            'preco_compra': produto.preco_compra
        })
    return jsonify(lista_estoque)

@app.route('/remover_produto/<int:id>', methods=['DELETE'])
def remover_produto(id):
    try:
        produto = Estoque.get_or_none(Estoque.id == id)

        if produto:
            produto.delete_instance()
            return jsonify({'message': 'Produto removido com sucesso!'}), 200
        else:
            return jsonify({'error': 'Produto não encontrada!'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/alterar_estoque/<int:id>', methods=['POST'])
def alterar_estoque(id):
    data = request.json
    preco_venda = data.get('preco_venda')  # Correção aqui

    try:
        produto = Estoque.get_or_none(Estoque.id == id)
        if produto is None:
            return jsonify({'error': 'Produto não encontrado!'}), 404

        produto.preco_venda = float(preco_venda)
        produto.save()

        return jsonify({'message': 'Produto alterado com sucesso!'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/cadastrar_compra', methods=['POST'])
def cadastrar_compra():
    data = request.json
    produto_nome = data.get('produto')  # Nome do produto ao invés do ID
    preco_compra = data.get('preco_compra')
    quantidade = data.get('quantidade')
    data_compra = data.get('data')

    try:
        # Verifica se o produto existe no estoque usando o nome
        produto = Estoque.get(Estoque.produto == produto_nome)

        # Cria o registro de compra
        Compra.create(produto=produto, preco_compra=preco_compra, quantidade=quantidade, data=data_compra)

        # Atualiza a tabela Estoque
        produto.quantidade += int(quantidade)
        produto.preco_compra = float(preco_compra)
        produto.save()

        return jsonify({"status": "success"}), 200

    except Estoque.DoesNotExist:
        return jsonify({"status": "error", "message": "Produto não encontrado no estoque."}), 404
    except IntegrityError as e:
        return jsonify(
            {"status": "error", "message": "Erro ao cadastrar compra. Produto já existente no banco de dados"}), 400


@app.route('/mostrar_compras')
def mostrar_compras():
    compras = Compra.select().order_by(Compra.data.desc())
    lista_compras =[]

    for compra in compras:
        lista_compras.append({
            'id': compra.id,
            'produto': compra.produto.produto,
            'quantidade': compra.quantidade,
            'preco_compra': compra.preco_compra,
            'data': compra.data,

        })
    return jsonify(lista_compras)

@app.route('/remover_compra/<int:id>', methods=['DELETE'])
def remover_compra(id):
    try:
        compra = Compra.get_or_none(Compra.id == id)#acessar dados de compras
        produto = Estoque.get(Estoque.id == compra.produto.id)#acessar dados do estoque

        produto.quantidade -= int(compra.quantidade)
        produto.save()

        if compra:
            compra.delete_instance()
            return jsonify({'message': 'Compra removida com sucesso!'}), 200
        else:
            return jsonify({'error': 'Compra não encontrada!'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/cadastrar_venda', methods=['POST'])
def cadastrar_venda():
    data = request.json
    nome = data.get('nome')
    produtosSelecionados = data.get('produtosSelecionados')

    try:

        for venda in produtosSelecionados:
            produto = venda.get('produto')
            quantidade = venda.get('quantidade')
            preco_venda = venda.get('preco')
            preco_total = venda.get('preco_total')

            Venda.create(nome=nome, produto=produto, quantidade=quantidade, preco_venda=preco_venda, valor_total=preco_total)
            produto = Estoque.get(Estoque.produto == produto)
            produto.quantidade -= int(quantidade)
            produto.save()


    except Exception as e:
        return jsonify({'status': 'error', 'message': f'Erro ao salvar no banco de dados: {str(e)}'}), 500

    return jsonify({'status': 'success', 'message': 'Venda cadastrada com sucesso!'})

@app.route('/mostrar_vendas')
def mostrar_vendas():
    vendas = Venda.select()
    lista_venda =[]

    for venda in vendas:
        lista_venda.append({
            'id': venda.id,
            'nome': venda.nome.nome,
            'produto': venda.produto.produto,
            'quantidade': venda.quantidade,
            'valor_total': venda.valor_total,
            'hora': venda.hora,
            'data': venda.data
        })
    return jsonify(lista_venda)

@app.route('/remover_venda/<int:id>', methods=['DELETE'])
def remover_venda(id):
    try:
        venda = Venda.get_or_none(Venda.id == id)#acessar dados da venda
        produto = Estoque.get(Estoque.produto == venda.produto.produto)#acessar dados do estoque

        produto.quantidade += int(venda.quantidade)
        produto.save()

        if venda:
            venda.delete_instance()
            return jsonify({'message': 'Venda removida com sucesso!'}), 200
        else:
            return jsonify({'error': 'Venda não encontrada!'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route('/download_relatorio', methods=['POST'])
def download_relatorio():
    data = request.json
    data1 = data.get('data1')
    data2 = data.get('data2')
    data_inicio = dt.strptime(data1, "%Y-%m-%d")
    data_fim = dt.strptime(data2, "%Y-%m-%d")

    # Filtra as vendas no intervalo de datas
    relatorio = Venda.select().where((Venda.data >= data_inicio) & (Venda.data <= data_fim))

    # Organiza os dados em dicionários
    dados = {}
    produtos = set()

    for venda in relatorio:
        nome = venda.nome.nome
        produto_nome = venda.produto.produto
        quantidade = venda.quantidade
        valor_total = venda.valor_total

        # Adiciona o produto ao conjunto de produtos
        produtos.add(produto_nome)

        # Organiza dados por pessoa
        if nome not in dados:
            dados[nome] = {'produtos': {}, 'total': 0}

        # Atualiza a quantidade e o valor total
        dados[nome]['produtos'][produto_nome] = dados[nome]['produtos'].get(produto_nome, 0) + quantidade
        dados[nome]['total'] += valor_total


    # Ordena os produtos para a ordem das colunas no Excel
    produtos = sorted(produtos)

    # Cria o arquivo Excel
    wb = Workbook()
    ws = wb.active
    ws.title = "Relatório de Vendas"

    # Escreve o cabeçalho
    ws.cell(row=1, column=1, value="Nome")
    for col_index, produto in enumerate(produtos, start=2):
        ws.cell(row=1, column=col_index, value=produto)
    ws.cell(row=1, column=len(produtos) + 2, value="Total Consumido")

    # Preenche os dados por pessoa e produtos
    for row_index, (nome, info) in enumerate(dados.items(), start=2):
        ws.cell(row=row_index, column=1, value=nome)

        for col_index, produto in enumerate(produtos, start=2):
            quantidade = info['produtos'].get(produto, 0)
            ws.cell(row=row_index, column=col_index, value=quantidade)

        ws.cell(row=row_index, column=len(produtos) + 2, value=info['total'])

    # Salva o arquivo temporário
    file_name = f"relatorio_vendas - {data_inicio.strftime('%Y-%m-%d')} a {data_fim.strftime('%Y-%m-%d')}.xlsx"
    file_path = os.path.join('relatorios', file_name)
    wb.save(file_path)

    # Retorna o arquivo como resposta
    return send_file(file_path, as_attachment=True, download_name=file_name)




@app.route('/download_database')
def download_database():
    try:
        return send_from_directory(app.config['UPLOAD_FOLDER_DB'], 'dados.db', as_attachment=True)
    except Exception as e:
        print("Erro ao enviar o arquivo:", e)
        return {"message": "Erro ao enviar o arquivo."}, 500




# ---------------------FIM FUNÇÕES MANIPULAÇÃO DE BANCO DE DADOS -----------------------


if __name__ == '__main__':
    app.run(debug=True)