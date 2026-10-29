from app.DataBase.connect import engine
from .models import Base
from sqlalchemy import orm, desc, asc, select, and_
from sqlalchemy.sql.expression import Select
from typing import Any, Callable, Optional


"""В данном файле происходит точка соприкосновения данных и sqlalchemy orm.
Открывается сессия и готовые, обработанные данные сначла добавляются в класс
таблиц созданных в models, после чего отправляются в БД и комитятся."""

class DataBaseManager():
    def __init__(self):
        # шаблон сессии (не саамо подключение) для работы с данными в таблце
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


    def insert_data(self, Table: Base, content: list[dict] = None) -> None:
        """Функция принимает класс, который является таблицой,
        и вставляет в аналог этого обьекта информацию в SQL

        Args:
            table (_type_): класс таблицы ORM.
            content (list[dict]): список со словарями данных.
        """
        # проверяем что на входе есть данные
        if content == None:
            print("Нет данных для сохранения")
            return
        
        # распаковываем словарь как именнованные значения в таблицу orm
        # данные попадут в оперативную память python (методанные)
        data = [Table(**content)]

        # далее мы отправляем данные в БД и комитим их
        try: 
            with self.session_obj() as ses:
                ses.add_all(data)
                ses.commit()
        except Exception as e:
            print(f"произошла ошибка {e}")
    
    def get_data(
            self,
            table: Base,
            sort: dict[str, Callable] = {},
            **kwargs
    ) -> list[Any]:
        """Функция получает данные из указанной
        таблицы

        Args:
            table (Base): Класс таблицы, который сущестует в БД.
            sort (dict): Словарь с правилами сортировки. Ключ это столбец
            а значение это функция asc или desc (направление соритровки).
            **kwargs: передаются правила для фильтрации данных

        Returns:
            list: Список объектов таблицы.
        """
        table_1: Select = select(table)

        # создаем правила, фильтр
        rules = [
            getattr(table, key) == val
            for key, val in kwargs.items()
        ]

        # собираем правила
        sort_rules = [
            direction(getattr(table, key))
            for key, direction in sort.items()
        ]
    
        # делаем запрос к БД
        with self.session_obj() as ses:
            stmt = (
                table_1
                .where(and_(*rules))
                .order_by(*sort_rules)
            )
            # получаем результат списком
            res = ses.scalars(stmt).all()

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