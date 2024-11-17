Flask Application with Telegram Integration
This Flask application serves as a management system for handling personnel, stock, purchases, and sales. It integrates with a Telegram bot to allow users to interact with the system directly from Telegram. The app also supports user authentication, file upload, and data manipulation through a SQLite database.

Features
Personnel Management: Register and manage personnel details.
Product Management: Add, modify, and remove products from the stock.
Sales Management: Register sales, calculate total value, and store transaction data.
Purchases Management: Register and track product purchases.
Telegram Bot Integration: Register personnel in the system via a Telegram bot, and send notifications to users on Telegram when purchases are made.
User Authentication: Login and logout functionalities with Flask-Login.
Prerequisites
Before running this application, ensure that you have the following installed:

Python 3.x
Flask
Flask-Login
Peewee (SQLite ORM)
OpenPyXL (for Excel file handling)
TeleBot (for Telegram Bot integration)
You also need to set up the following environment variables:

SECRET_KEY: Secret key for session management.
DATABASE_USUARIO: Database username.
DATABASE_SENHA: Database password.
TELEGRAM_TOKEN: Your Telegram bot token.
Installation
Clone the repository:

bash
Copiar código
git clone https://github.com/yourusername/your-repository.git
cd your-repository
Create a virtual environment:

bash
Copiar código
python3 -m venv venv
source venv/bin/activate  # For Linux/macOS
venv\Scripts\activate     # For Windows
Install dependencies:

bash
Copiar código
pip install -r requirements.txt
Set the necessary environment variables (adjust according to your environment):

bash
Copiar código
export SECRET_KEY='your_secret_key'
export DATABASE_USUARIO='your_database_username'
export DATABASE_SENHA='your_database_password'
export TELEGRAM_TOKEN='your_telegram_bot_token'
Run the application:

bash
Copiar código
python app.py
Usage
Telegram Bot
The Telegram bot allows personnel to register and receive notifications. Upon running the bot, users can select their names from a list, and their chat_id will be saved to the database.
Commands:
/start: Displays a list of registered personnel for selection.
The user selects their name, and the bot responds with a confirmation.
Web Application
The application provides a web interface with several routes:
/: The homepage of the application.
/pagina_login: The login page.
/protected: The protected admin page (requires login).
/sucesso: A success page.
/error: An error page.
API Endpoints
The application exposes several API endpoints for data manipulation:

Personnel Management:
POST /cadastrar_pessoal: Registers a new person.
GET /mostrar_pessoal: Displays all registered personnel.
DELETE /remover_pessoal/<id>: Removes a person by ID.
Product Management:
POST /cadastrar_produto: Registers a new product.
GET /mostrar_produtos: Displays all products.
DELETE /remover_produto/<id>: Removes a product by ID.
POST /alterar_estoque/<id>: Updates product stock information.
Purchase Management:
POST /cadastrar_compra: Registers a new purchase.
GET /mostrar_compras: Displays all purchases.
DELETE /remover_compra/<id>: Removes a purchase by ID.
Sale Management:
POST /cadastrar_venda: Registers a new sale.
Contributing
Contributions are welcome! Please fork the repository, create a new branch, make your changes, and submit a pull request.

License
This project is licensed under the MIT License - see the LICENSE file for details.

Feel free to adjust the instructions, file paths, and environment variable details according to your specific project setup.
