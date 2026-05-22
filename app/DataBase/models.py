from sqlalchemy import Column, Time, String, orm, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime, time, timezone


# сервисный класс
class Base(orm.DeclarativeBase):
    pass

class ChatHistory(Base):
    __tablename__ = "ChatHistory"

    id:Mapped[int] = mapped_column(primary_key=True)
    role: Mapped[str] = mapped_column(nullable=False)
    ai_v: Mapped[str] = mapped_column(default="None")
    retelling: Mapped[str]
    content: Mapped[str] = mapped_column(nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now())
    message_time: Mapped[time] = mapped_column(Time, nullable=True)






























# обьект для хранения всех структур, таблиц и т.п.
# metadata_obj = sqlalchemy.MetaData()
# chat_history = sqlalchemy.Table(
#     "history",
#     metadata_obj,
#     Column("id", Integer, primary_key=True),
#     Column("ai_version", String),
#     Column("apilog", String, nullable=False),
#     Column("content", String),
#     Column("time", String(), default=datetime.now().strftime("%H:%M"))
# )
