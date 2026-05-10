import sqlalchemy
from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

# обьект для хранения всех структур, таблиц и т.п.
metadata_obj = sqlalchemy.MetaData()
chat_history = sqlalchemy.Table(
    "history",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("ai_version", String),
    Column("apilog", String, nullable=False),
    Column("content", String),
    Column("time", DateTime, default=datetime.now().strftime("%H:%M"))

)
