import re
import markdown

def clean_markdown_response(text):
    return text.strip()


def pars_markopwn(f_path: str):
    """Открывает файл, парсит в html и оборачивает теги 
    table в div.

    Args:
        f_path (str): путь до файла
    """
    with open(f_path, "r", encoding="utf-8") as f:
        text = f.read()

    wrap_res = wrap_tables(text)

    with open("app/htmltest.txt", "w", encoding="utf-8") as f2:
        f2.write(wrap_res)
    
    

def wrap_tables(markdown_str: str) -> str:
    """Парсит markdown и оборачивает теги table в div.

    Args:
        html (str): html строка
    """
    html = markdown.markdown(markdown_str, extensions=["tables", "fenced_code", "nl2br", 'sane_lists', ])
    html = re.sub(r"<table>", "<div class='table-wrap'><table>", html)
    html = re.sub(r"<\/table>", "</table></div>", html)

    html = re.sub(r"<\/h3>", "</h3><hr>", html)
    return html


from bs4 import BeautifulSoup
from pygments import highlight
from pygments.lexers import get_lexer_by_name, TextLexer
from pygments.formatters import HtmlFormatter

def code_parser(text: str) -> str:
    """Функция генерирует классы для подсветки кода.

    Args:
        text (str): входной html

    Returns:
        BeautifulSoup: возвращает готовый html
    """
    soup = BeautifulSoup(text, 'html.parser')
    formatter = HtmlFormatter(cssclass='highlight')

    for code in soup.select('pre > code[class]'):
        lang = next(
            (c.replace('language-', '') for c in code['class'] if c.startswith('language-')),
            None
        )

        source = code.get_text().strip()
        
        try:
            lexer = get_lexer_by_name(lang) if lang else TextLexer()
        except Exception:
            lexer = TextLexer()  # если язык неизвестен — без подсветки
        
        highlighted = highlight(source, lexer, formatter)

        new_tag = BeautifulSoup(highlighted, 'html.parser')

        code.parent.replace_with(new_tag)

        # Получаем CSS для вставки в <style>
    return str(soup)









        
