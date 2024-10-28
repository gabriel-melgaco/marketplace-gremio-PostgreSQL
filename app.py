from flask import Flask, render_template, request, jsonify
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from peewee import *
import datetime
import os
from werkzeug.utils import secure_filename
import unicodedata
import re

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/img'


#-------------LOGIN MANAGER ---------------------------------------


#-------------CLASSES BANCO DE DADOS ------------------------------
db = SqliteDatabase('dados.db')
class Pessoal(Model):
    id = IntegerField(primary_key=True, unique=True)
    posto = CharField()
    nome = CharField(unique=True)
    telefone = IntegerField()

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
    preco_compra = ForeignKeyField(Estoque, field='preco_compra', on_update='CASCADE', on_delete='CASCADE')
    quantidade = IntegerField()
    data = DateField()

    class Meta:
        database = db
        db_table = 'compra'


db.connect()
db.create_tables([Pessoal, Estoque, Venda, Compra])
#--------------------- FIM CLASSES BANCO DE DADOS --------------------



# ---------------------RENDERIZAÇÃO DE PÁGINAS -----------------------
@app.route("/")
def index():
    return render_template('index.html')

@app.route("/login")
def login():
    return render_template('login.html')

@app.route("/admin")
def admin():
    return render_template('admin.html')
# ---------------------FIM DE RENDERIZAÇÃO DE PÁGINAS -----------------------


# ---------------------FUNÇÕES MANIPULAÇÃO DE BANCO DE DADOS -----------------------
@app.route('/cadastrar_pessoal', methods=['POST'])
def cadastrar_pessoal():
    data = request.json
    posto = data.get('posto')
    nome = data.get('nome')
    telefone = data.get('telefone')

    try:

        Pessoal.create(posto=posto, nome=nome, telefone=telefone)
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
            'telefone': pessoais.telefone
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
    categoria = request.form.get('categoria')
    preco_venda = request.form.get('preco_venda')
    foto = f'static/img/{tratar_string(produto)}.png' # o que vai ser salvo no banco de dados
    foto_salva = request.files.get('foto') # a que vai ser salva na pasta /static/img

    # Validações básicas
    if not all([produto, tamanho, unidade, categoria, preco_venda, foto_salva]):
        return jsonify({'status': 'error', 'message': 'Todos os campos são obrigatórios'}), 400

    # Salva no banco de dados
    try:
        Estoque.create(produto=produto, tamanho=tamanho, unidade=unidade, categoria=categoria, preco_venda=preco_venda, foto=foto)
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
    estoque = Estoque.select()
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

# ---------------------FIM FUNÇÕES MANIPULAÇÃO DE BANCO DE DADOS -----------------------

if __name__ == '__main__':
    app.run(debug=True)