from sqlmodel import SQLModel, Field, create_engine, Session
from typing import Optional, Dict, Any
import json
from datetime import datetime

# настройка базы данных
sqlite_url = "sqlite:///database.db"
engine = create_engine(sqlite_url, echo=True)

class Project(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(default="Новый проект")
    blocks: str = Field(default="[]")  # json строка с блоками
    header_settings: str = Field(default="{}")  # настройки шапки
    footer_settings: str = Field(default="{}")  # подвала
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now().isoformat())

# создание таблиц
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

# чтоб получить сессию базы данных
def get_session():
    with Session(engine) as session:
        yield session