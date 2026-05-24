from sqlalchemy import ForeignKey, Time, String, orm, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime, time, timezone


# сервисный класс
class Base(orm.DeclarativeBase):
    pass

class Messages(Base):
    """Таблица в котрой будут храниться сообщения
    и сервисная информация о них.

    Args:
        Base (_type_): Сервисный класс.
    """
    __tablename__ = "messages"

    id:Mapped[int] = mapped_column(primary_key=True)
    chat_id: Mapped[int] = mapped_column(ForeignKey("chat.id"), nullable=False)
    role: Mapped[str] = mapped_column(nullable=False)
    ai_v: Mapped[str] = mapped_column(default="None")
    content: Mapped[str] = mapped_column(nullable=True)
    retelling: Mapped[str]
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now())
    message_time: Mapped[time] = mapped_column(Time, nullable=True)


class Chat(Base):
    """Таблица для хранения информации о чатах.

    Args:
        Base (_type_): Сервисный класс.
    """
    __tablename__ = "chat"

    id: Mapped[int] = mapped_column(primary_key=True)
    annotation: Mapped[str] = mapped_column(nullable=False)
    req_count: Mapped[int] = mapped_column(default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now())



























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
