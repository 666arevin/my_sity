from . import app
from flask import render_template
from flask import redirect, url_for, request

def print_hello():
    print("Hello, word!")

@app.route("/")
@app.route("/index")
def index():
    return render_template("authorization.html")

@app.route('/api/fetch', methods=['POST'])
def authorization():
    login = request.form.get('login')
    password = request.form.get('password')
    print(f"Login - {login}, password - {password}.")

    return redirect(url_for('index'))