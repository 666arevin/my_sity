from dotenv import load_dotenv
import os

import sqlalchemy
from sqlalchemy import Engine

def get_connect_str() -> str:
    """Берет данные из .env и на их основе,
    создает строку подключения.

    Returns:
        str: возвращает созданноу строку подкючения.
    """
    load_dotenv()

    DB_HOST:str | None = os.getenv("DB_HOST")
    DB_PORT:int | None = os.getenv("DB_PORT")
    DB_USER: str | None = os.getenv("DB_USER")
    DB_PASS: str | None = os.getenv("DB_PASS")
    DB_NAME: str | None = os.getenv("DB_NAME")

    DATABASE_URL = f"postgresql+psycopg2://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    assert "None" not in DATABASE_URL, "Ошибка данных для подключения"
    
    return DATABASE_URL

# создаем строку для подключения к БД
connect_str = get_connect_str()
# создаем обьект подключения, но самого подключения еще нет
engine: Engine = sqlalchemy.create_engine(
    connect_str,
    pool_recycle=3600,
    echo=False,
)