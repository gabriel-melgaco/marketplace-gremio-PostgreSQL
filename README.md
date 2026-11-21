# Marketplace Grêmio Falcão

A web application for inventory and sales management, built with Flask and PostgreSQL, with a Telegram bot for automatic notifications.

The app lets you register personnel, products, sales, and purchases, and provides an admin interface for managing inventory and viewing sales data.

## Features

- **Admin login**: Access control with authentication using Flask-Login
- **Personnel registration**: Register personnel with name, rank, phone number, and chat ID for Telegram integration
- **Product registration**: Add products to inventory with category, unit, size, quantity, and sale price
- **Sales and purchases**: Record sales and purchases with automatic inventory updates
- **Telegram integration**: The Telegram bot notifies registered personnel about purchases made in their name
- **Admin dashboard**: View and manage products, sales, purchases, and personnel through a web interface
- **Sales reports**: Export sales reports to Excel (`.xlsx`) filtered by date range
- **Paginated listings**: Browse large product, sales, and personnel lists page by page

## Tech Stack

- **Flask**: Python web framework
- **Flask-Login**: Login session management
- **Peewee**: ORM for database access
- **PostgreSQL**: Relational database
- **Telegram Bot API**: Telegram integration for notifications (pyTelegramBotAPI)
- **OpenPyXL**: Excel report generation
- **Bootstrap**: Front-end styling

## Requirements

- Python 3.12+
- PostgreSQL 14+
- A Telegram bot token (get one from [@BotFather](https://t.me/botfather))

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/gabriel-melgaco/marketplace-gremio.git
cd marketplace-gremio
```

### 2. Create a virtual environment

```bash
python3 -m venv venv
source venv/bin/activate
```

On Windows, activate it with:

```powershell
venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Create the PostgreSQL database

```sql
CREATE DATABASE marketplace;
```

The application creates its tables automatically on the first run.

### 5. Configure the environment variables

Create a `.env` file in the project root:

```env
SECRET_KEY=your-secret-key
DATABASE_USUARIO=postgres
DATABASE_SENHA=your-database-password
TELEGRAM_TOKEN=your-telegram-bot-token
POSTGRES_USUARIO=postgres
POSTGRES_SENHA=your-database-password
POSTGRES_HOST=localhost
POSTGRES_PORTA=5432
POSTGRES_NAME=marketplace
```

Notes:

- `DATABASE_USUARIO` and `DATABASE_SENHA` are also the credentials used to log in to the admin area.
- `POSTGRES_PORTA` is the database port (the variable name is in Portuguese in the code).
- `SECRET_KEY` should be a long random string.

### 6. Run the application

```bash
python app.py
```

This starts the Flask web server and the Telegram bot in the same process.

The application will be available at [**http://localhost:5000**](http://localhost:5000).

## Telegram Setup

1. Create a bot with [@BotFather](https://t.me/botfather) and copy the token to `TELEGRAM_TOKEN`.
2. Register the personnel in the admin area.
3. Send `/start` to the bot and select your name. The bot saves your Telegram chat ID and starts sending notifications about purchases made in your name.

## Usage

- Log in at [**http://localhost:5000/pagina_login**](http://localhost:5000/pagina_login) using `DATABASE_USUARIO` and `DATABASE_SENHA`.
- The admin dashboard is available after login.
- Sales reports are generated as `.xlsx` files and saved to the `relatorios/` folder before download.

## Project Structure

```
app.py             # Flask app, database models, routes, and Telegram bot
templates/         # HTML templates
static/            # CSS, JavaScript, and images
relatorios/        # Generated sales reports
requirements.txt   # Python dependencies
```

## Contributing

Feel free to contribute to this project!

## License

This project was developed for learning purposes and as a functional application for managing inventory and sales.

## Author

Gabriel Melgaço - [GitHub](https://github.com/gabriel-melgaco)

---

**Note**: This project is under constant development. Improvements and new features may be added as needed.
