from . import app
from flask import render_template
from flask import redirect, url_for, request, jsonify
from .ai_agent import ChatGPT
import markdown
import time

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
    # print("Получил")
    # textarea = request.form.get('prompt')
    # resp = ChatGPT(textarea, "free")
    # html = markdown.markdown(resp, extensions=['fenced_code', 'tables'])
    # print(html)
    # return jsonify({"data": html})
    return "200"