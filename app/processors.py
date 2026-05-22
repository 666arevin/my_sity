from .ai_agent import AI_request
from datetime import datetime
from .DataBase.core import DataBaseManager
from .DataBase.models import ChatHistory

db_manager = DataBaseManager()

def save_to_meatdata(message_data: dict):
    """Сохраняет данные в спец классе, управляющим 
    базой данных

    Args:
        message_data (dict): Словарь с данными
    """
    # берем текущее время и доавбляем в сорварь
    message_time = datetime.now().strftime("%H:%M") 
    message_data["message_time"] = message_time

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

    db_manager.insert_data(ChatHistory, message_data)
    # db_manager.content = message_data
    