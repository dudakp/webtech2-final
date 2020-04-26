from flask import request, jsonify
from flask_login import login_required
from werkzeug.security import generate_password_hash, check_password_hash

from flask_app import app, login_manager
from flask_app import db
from flask_app import matLab
from bson.json_util import dumps
from oct2py import octave

from flask_app.models.forms import RegistrationForm, LoginForm
from flask_app.models.auth import User


@app.route('/version')
def version():
    return 'version: 0.0.1 ALPHA'


@app.route('/plane-data')
def plane_data():
    octave.cd(matLab)
    param_r = request.args.get('r')
    arr = octave.plane(float(param_r)).tolist()

    return jsonify(arr)


@app.route('/pendulum-data')
def pendulum_data():
    octave.cd(matLab)
    param_r = request.args.get('r')
    arr = octave.pendulum(float(param_r)).tolist()

    return jsonify(arr)


@app.route('/suspension-data')
def suspension_data():
    octave.cd(matLab)
    param_r = request.args.get('r')
    arr = octave.suspension(float(param_r)).tolist()

    return jsonify(arr)


@app.route('/ball-data')
def ball_data():
    octave.cd(matLab)
    param_r = request.args.get('r')
    arr = octave.ball(float(param_r)).tolist()

    return jsonify(arr)


@app.route('/fake-user')
def fake_user():
    user = db.auth.find_one({'firstName': 'Jozko'})

    return dumps(user)


@app.route('/register', methods=['POST'])
def register_user():

    form = RegistrationForm(request.form)

    if request.method == 'POST' and form.validate():
        user = {
            'firstName': form.firstName.data,
            'lastName': form.lastName.data,
            'username': form.username.data,
            'email': form.email.data,
            'password': generate_password_hash(form.password.data, method='sha256'),
            'apiKey': '',
            'active': True,
            'logged_in': False
        }
        db.auth.insert(user)
        return jsonify(user)


@login_manager.user_loader
def load_user(user_id):
    found = db.auth.find_one({'username': user_id})
    return User(found['username'], found['password'], found['email'],
                found['firstName'], found['lastName'], found['active'], found['logged_in']
                )


@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm(request.form)

    if request.method == 'POST' and form.validate():
        user = db.auth.find_one({'username': form.username.data})
        if user and check_password_hash(user['password'], form.password.data):
            user['logged_in'] = True
            db.auth.save(user)


@app.route('/logout', methods=['POST'])
@login_required
def logout():
    form = LoginForm(request.form)

    if request.method == 'POST' and form.validate():
        user = db.auth.find_one({'username': form.username.data})
        if user and check_password_hash(user['password'], form.password.data):
            user['logged_in'] = False
            db.auth.save(user)
