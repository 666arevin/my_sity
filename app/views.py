from . import app
from flask import render_template
from flask import redirect, url_for, request, jsonify, stream_with_context, Response
from .ai_agent import AI_request
from . import utils
from .DataBase import core
from . import utils
from .processors import save_user_message, get_chats_from_db, get_chat_data
from .DataBase.models import Messages, Chat
from sqlalchemy.exc import OperationalError



@app.errorhandler(OperationalError)
def handle_db_error(error):
    """Обработчик ошибок базы данных.

    Args:
        error (OperationalError): Исключение, связанное с базой данных.

    Returns:
        Response: Ответ с сообщением об ошибке и статусом 500.
    """
    return jsonify({"error": "Произошла ошибка базы данных. Пожалуйста, попробуйте позже."}), 500

@app.route("/")
@app.route("/index")
def index():
    return render_template("authorization.html")

@app.route('/api/authorization', methods=['POST'])
def authorization():
    login = request.form.get('login')
    password = request.form.get('password')
    print(f"Login - {login}, password - {password}.")

    return redirect(url_for('index'))

@app.route('/api/userinput', methods=["POST"])
def user_input():
    
    # сохраняем в БД, сообщение пользователя
    data = request.form.to_dict()
    save_user_message(data)
    # получаем текст из формы
    textarea = request.form.get('content')

    stream = stream_with_context(AI_request(textarea, model="gpt-5.4-mini"))

    # устаревшая часть
    # resp = str(stream).strip()
    # html = utils.wrap_tables(resp)
    # html = utils.code_parser(html)


    # сохраняем запрос ИИ в БД
    # save_ai_message(data, resp)

    return Response(stream, mimetype='text/event-stream')


@app.route("/get_chats", methods=["GET"])
def send_chats():
    """Выдает клиенту список его чатов.

    Returns:
        json: Список словарей с данными о чатах.
    """
    chats = get_chats_from_db()
    return jsonify({"data": chats})

@app.route("/get_chatData", methods=["POST"])
def send_chat_data():
    """Отправляет все сообщения из чата клиенту.

    Returns:
        json: Список словарей с данными о сообщениях чата.
    """
    chat_id = request.get_json()
    data_json = get_chat_data(chat_id)
    return jsonify(data_json)

@app.route("/create_chat", methods=["POST"])
def create_chat():
    """Создает новый чат, добавляя его в БД.
    """
    