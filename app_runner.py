import threading
from app import app, run_telebot

def run_flask():
    app.run(host='0.0.0.0', port=5000)

if __name__ == "__main__":
    # Thread para rodar o Telegram Bot
    telebot_thread = threading.Thread(target=run_telebot)
    telebot_thread.daemon = True
    telebot_thread.start()

    # Rodar o Flask
    run_flask()
