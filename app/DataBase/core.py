from app.DataBase.connect import engine
from .models import Base
from sqlalchemy import orm, desc
from typing import Any


class DataBaseManager():
    def __init__(self):
        # шаблон сессии для работы с данными в таблце
        self.session_obj = orm.sessionmaker(engine)
        # контент, который будет добавлен в модель в metadata
        # это методанные 2 уровня
        self.content = list()

    def create_table(self) -> None:
        """Через сервисный класс по котрому строяться все orm
        таблицы, вызываем методы который создаст все таблице в
        базе данных
        """
        Base.metadata.drop_all(engine)
        Base.metadata.create_all(engine)


    def insert_data(self, table, content: list[dict] = None):
        """Функция принимает класс, который является таблицой,
        и вставляет в аналог этот обьекта информацию в SQL

        Args:
            table (_type_): класс таблицы.
            content (list[dict]): список со словарями данных.
        """
        print(f"insert_data отработал, content: {content}")
        # проверяем что на входе есть данные
        if content == None:
            print("Нет данных для сохранения")
            return
        
        # делаем методанные 
        data = [table(**content)]


        try: 
            with self.session_obj() as ses:
                ses.add_all(data)
                ses.commit()
        except Exception as e:
            print(f"произошла ошибка {e}")
    
    def get_chats(self, table) -> list[Any]:
        """Функция получает данные из указанной
        таблицы

        Args:
            table (Base): Класс таблицы, который
            сущестует в БД.

        Returns:
            list: Список объектов таблицы.
        """
        with self.session_obj() as ses:
            res = ses.query(table).order_by(desc(table.created_at)).all()
            return res












# def create_table():
#     metadata_obj.create_all(engine)

# def show_data_history():
#     with engine.connect() as conn:
#         stmt = sqlalchemy.insert(chat_history).values(
#             [
#                 {"ai_version": "DeepSeek",
#                  "apilog": "Что за прекрасный день.",
#                  "content": "content от ИИ",
#                 }
#             ]
#         )
#         res = conn.execute(stmt)
#         conn.commit()
#     print(res.rowcount)