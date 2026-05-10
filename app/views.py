from . import app
from flask import render_template
from flask import redirect, url_for, request, jsonify
from .ai_agent import ChatGPT
from . import utils
import markdown
import time
import re
from . import utils



def print_hello():
    print("Hello, word!")

@app.route("/")
@app.route("/index")
def index():
    return render_template("authorization.html")

@app.route('/api/authorization', methods=['POST'])
def authorization():
    login = request.form.get('login')
    password = request.form.get('password')
    print(f"Login - {login}, password - {password}.")

    return redirect(url_for('index'))

@app.route('/api/userinput', methods=["POST"])
def user_input():
    print("Получил")
    textarea = request.form.get('prompt')
    resp = str(ChatGPT(textarea, "free")).strip()
    html = utils.wrap_tables(resp)
    html = utils.code_parser(html)
    with open("data.txt", 'w', encoding="utf-8") as f:
        f.write("Необработанный - " + resp)
        f.write("\nОбработанный - " + str(html))
    return jsonify({"data": html})

