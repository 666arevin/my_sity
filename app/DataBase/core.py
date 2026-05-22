from app.DataBase.connect import engine
from .models import Base, ChatHistory
import sqlalchemy
from sqlalchemy import orm


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