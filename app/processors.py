from .ai_agent import AI_request
from datetime import datetime
from .DataBase.core import DataBaseManager
from .DataBase.models import Messages, Chat

"""Данный файл является прослойкой, которой берет на себя обработку данных,
полученнх от клиента. А также вызывает менеджер DataBaseManager, который
вставит все данные в базу данных и закомитит их."""

db_manager = DataBaseManager()

def save_user_message(message_data: dict, ai_response: str | None = None) -> None:
    """Сохраняет сообщение в базу данных.
    Сохраняемые параметра: роль, краткое содержание, контент, текущие, время сообщения.

    Args:
        message_data (dict): Словарь с данными
    """
    # берем текущее время и добавляем в словарь
    message_time = datetime.now().strftime("%H:%M") 
    message_data["message_time"] = message_time

    # добавлем id чата (пока что все сообщения относятся к 11 чату)
    message_data["chat_id"] = 11

    # разделяем сообщение от ИИ и от пользователя
    # если ai_response не пустое значит сообщение от ИИ
    if ai_response:

        # записываем контекст сообщения
        message_data["content"] = ai_response

        # делаем краткое содержание ответа от ИИ 
        prompt = "Сделай краткое содержание текста, без потери смысла."
        resp = AI_request(ai_response, model="free", sys_prompt=prompt)

        # записываем краткое содержания от ИИ
        message_data["retelling"] = resp

    # если нет ai_response, значит сообщение от пользователя
    elif ai_response == None:
        # краткое содрежание = контенту
        message_data["retelling"] = message_data["content"]


    # вставляем в orm модель Messages собранный словарик
    db_manager.insert_data(Messages, message_data)


def get_chats_from_db():
    # надо будет добавить обротку сессии пользователя
    """Получает данные о чатах пользователя из БД
    и обрабатывает их выдавая список словарей.

    Returns:
        _type_: list[dict]: Список словарей с данными о чатах.
    """
    data = db_manager.get_chats(Chat)
    chats_json = list()
    for i in data:
        chats_json.append({
            "id": i.id,
            "annotation": i.annotation,
            "req_count": f"Количество запросов: {i.req_count}",
            "created_at": i.created_at.isoformat() if i.created_at else None
        })
    return chats_json

def get_chat_data(chat_id: int):
    # надо будет добавить обротку сессии пользователя
    chat_data = db_manager.get_chats(Messages)
    data_json = list()
    # берем только сообщения с нужным id и делаем список словарей
    for i in chat_data:
        if str(i.chat_id) == chat_id:
            data_json.append({
                "role": i.role,
                "ai_v": i.ai_v,
                "content": i.content,
                "retelling": i.retelling,
                "message_time": str(i.message_time)[:-3]
            })
    return data_json

