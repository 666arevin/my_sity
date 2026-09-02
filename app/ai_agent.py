import requests
import json
from typing import Generator
import re
import traceback
import dotenv
import os

# загружаем ключ из .env
dotenv.load_dotenv()
openkey = os.getenv("OpenAI_API_KEY")

def AI_request(prompt: str, model: str = "free", sys_prompt: str = "Верни в формате Markdown") -> Generator[str, None, None]:
    """Функция делает запрос к ИИ и возвращает текст,
    работает со строками

    Args:
        prompt (str): Ввод пользователя
        model (str, optional): Название модели, котрую
        неоходимо использовать. Defaults to "free".
        sys_prompt (str, optional): Системный промпт, можно
        задать или не делать вовсе. Defaults to "".

    Returns:
        str: Ответ от ИИ
    """

    print(f"Промпт для ИИ: {prompt}, sys_prompt для ИИ: {sys_prompt}, модель для ИИ: {model}")
    models = {
        "gpt-5.4-mini": "openai/gpt-5.4-mini",
        "gpt-5.4-nano": "openai/gpt-5.4-nano",
        "free": "openai/gpt-oss-20b:free",
        "free2": "deepseek/deepseek-v4-flash",
        "auto": "openrouter/auto"
    }
    # получаем реальное название модели по псевдониму
    model_pik = models.get(model)

    response = None
    # делаем запрос к ИИ с включенным стримом
    try:
        response = requests.post(
        url="https://openrouter.ai/api/v1/chat/completions",
        headers={"Authorization": f"Bearer {openkey}",
                "Content-Type": "application/json"},
        stream=True,
        data=json.dumps({
        "model": model_pik,
        "stream": True,
        "messages": [
            {
            "role": "system",
            "content": sys_prompt
        },
        {
            "role": "user",
            "content": prompt
        }
        ],
        "provider": {
        "ignore": [
            "openai",      # Самые жесткие блокировки
            "anthropic",   # Тоже часто блокируют напрямую
            "google"       # Если запрос идет напрямую (не через посредников)
        ],
        "order": ["together", "fireworks", "deepinfra", "novita"]},
        "route": "fallback",
        "transforms": ["unfiltered"] 
        }))

        # выдаст ошибку если не удасться подключиться к серверу ИИ или возникнут проблемы с сетью
        response.raise_for_status()

        # Построчно читаем ответ ИИ и сразу перенаправляем клиенту
        for line in response.iter_lines():
            if line:
                # декодируем строку из байтов в текст
                decoded_line = line.decode('utf-8')
                # отрпавляем клиенту только строки с данными, игнорируя служебные сообщения
                if decoded_line.startswith("data: "):
                    # убираем преписку data, чтобы в дальнейшем преобразовать строку в словарь
                    decoded_line = decoded_line[5:].strip()
                    # п
                    if decoded_line == "[DONE]":
                        break
                    # Передаем строку дальше клиенту в формате SSE
                    yield f"{decoded_line}\n\n"
                    
    except GeneratorExit:
        # КРИТИЧЕСКИ ВАЖНО: Этот блок сработает СРАЗУ, как только клиент 
        # на сайте нажмет "Отмена" (или закроет вкладку), разорвав сокет с Flask.
        print("[Flask] Клиент отменил запрос. Экстренно закрываем соединение с ИИ...")
    except Exception as e:
        print(f"Ошибка: {e}")
        print(traceback.print_exc())
    finally:
        # Гарантированно закрываем сетевой сокет с ИИ
        if response is not None:
            response.close()


# for i in AI_request("привет как дела"):
#     print(i)

        