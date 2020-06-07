import json
import os
import pathlib

from flask import Flask, request, session, send_from_directory
from flask_babel import Babel
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_login import LoginManager
from flask_pymongo import PyMongo

config_json_path = os.path.join(str(pathlib.Path.cwd()), 'flask_app/config.json')
mongo = PyMongo()
b_crypt = Bcrypt()

login_manager = LoginManager()
cors = CORS(resources={r"/api/*": {"origins": "*"}})

app = Flask(__name__)

# i18n
babel = Babel(app)

with open(config_json_path) as f:
    config = json.load(f)


@babel.localeselector
def get_locale():
    # if the user has set up the language manually it will be stored in the session,
    # so we use the locale from the user settings
    try:
        language = session['language']
    except KeyError:
        language = None
    if language is not None:
        return language
    return request.accept_languages.best_match(app.config['LANGUAGES'].keys())


def create_app(config_json=config_json_path):
    # global config
    app.config.from_json(config_json, silent=False)
    cors.init_app(app)
    mongo.init_app(app)
    b_crypt.init_app(app)
    login_manager.login_view = 'auth.login'
    login_manager.init_app(app)

    # blueprints
    from flask_app.compute.routes import compute
    from flask_app.auth.routes import auth
    from flask_app.user.routes import user
    from flask_app.view.routes import view
    app.register_blueprint(compute)
    app.register_blueprint(auth)
    app.register_blueprint(user)
    app.register_blueprint(view)

    return app


@app.context_processor
def inject_conf_var():
    return dict(
        AVAILABLE_LANGUAGES=config['LANGUAGES'],
        CURRENT_LANGUAGE=session.get('language', request.accept_languages.best_match(config['LANGUAGES'].keys())))


@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')

