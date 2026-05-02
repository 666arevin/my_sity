import re

def clean_markdown_response(text):
    # Убираем блок ```markdown ... ``` или просто ``` ... ```
    # который ИИ часто добавляет вокруг ответа
    # text = re.sub(r'^```markdown\s*', '', text, flags=re.IGNORECASE)
    # text = re.sub(r'^```\s*', '', text)
    # text = re.sub(r'\s*```$', '', text)
    return text.strip()

def wrap_tables(text):
    pattern = r"bro"
    resp = re.subn(pattern, "girl", text)
    return resp

test = "Hi bro, how you are doing this table, bro"
test2 = "bro"
result = wrap_tables(test)
print(result)