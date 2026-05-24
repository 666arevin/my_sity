from .ai_agent import AI_request
from datetime import datetime
from .DataBase.core import DataBaseManager
from .DataBase.models import Messages, Chat

db_manager = DataBaseManager()

def save_to_meatdata(message_data: dict) -> None:
    """Сохраняет сообщение в базу данных.
    Сохраняемые параметра: роль, краткое содержание, контент, текущие, время сообщения.

    Args:
        message_data (dict): Словарь с данными
    """
    # берем текущее время и доавбляем в сорварь
    message_time = datetime.now().strftime("%H:%M") 
    message_data["message_time"] = message_time

    # добавлем id чата
    message_data["chat_id"] = 11

    # если это сообщение пользователя то краткое содрежание = контенту
    if message_data.get("role") == "user":
        message_data["retelling"] = message_data["content"]
    else:
        # елси это ответ от ИИ деаем краткое содрежание
        content = message_data.get("content")
        prompt = "Сделай краткое содержание текста убрав mardown, без потери смысла."

        # генерируем краткое содержание текста ИИ
        resp = AI_request(content, model="free", sys_prompt=prompt)
        message_data["retelling"] = resp
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