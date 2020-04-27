import os
import pathlib

from flask import Flask
from flask_login import LoginManager
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt

config_json_path = os.path.join(str(pathlib.Path.cwd()), 'flask_app/config.json')
mongo = PyMongo()
b_crypt = Bcrypt()
login_manager = LoginManager()
# login_manager.login_view('login')


def create_app(config_json=config_json_path):
    app = Flask(__name__)
    app.config.from_json(config_json, silent=False)
    mongo.init_app(app)
    b_crypt.init_app(app)
    login_manager.init_app(app)

    from flask_app.compute.routes import compute
    from flask_app.auth.routes import auth
    from flask_app.user.routes import user
    app.register_blueprint(compute)
    app.register_blueprint(auth)
    app.register_blueprint(user)

    return app
