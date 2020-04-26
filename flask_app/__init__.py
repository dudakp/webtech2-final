from flask import Flask
from flask_login import LoginManager
from flask_pymongo import PyMongo


app = Flask(__name__)
app.config['SECRET_KEY'] = 'e751eafb3da666f6c31a766e766a0b22b4130f917211e5607213f9e3f8b3cb28'
app.config["MONGO_URI"] = "mongodb://admin:password@147.175.121.89:27017/webtech2?authSource=admin&readPreference" \
                          "=primary&appname=MongoDB%20Compass&ssl=false"
app.config['MATLAB_FORMULAE_PATH'] = '/home/xhajdukp/flask_app/flask_app/matlab/'
mongo = PyMongo(app)
db = mongo.db
matLab = app.config['MATLAB_FORMULAE_PATH']
login_manager = LoginManager()

login_manager.init_app(app)

from flask_app import routes
