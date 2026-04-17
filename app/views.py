from . import app
from flask import render_template

def print_hello():
    print("Hello, word!")

@app.route("/")
@app.route("/index")
def index():
    return render_template("authorization.html")