#!/usr/bin/env python3
from app import app
from app.DataBase import core
from app.DataBase.core import ChatHistory

app.run(debug=True, host="0.0.0.0")

# input_data = [{"role": "user", "ai_v": "DeeSeek", "apilog": "Прекрасный день", "content": "content", "message_time": "13:12"}]
# core.create_table()
# core.insert_data(ChatHistory, input_data)
