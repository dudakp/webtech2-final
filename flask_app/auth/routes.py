import os
from binascii import hexlify

from bson.json_util import dumps
from flask import Blueprint, request, current_app
from flask_login import login_required, current_user, login_user, logout_user

from flask_app import b_crypt, mongo
from flask_app.auth.forms import RegistrationForm, LoginForm
from flask_app.user.models import User

auth = Blueprint('auth', __name__)


@auth.route('/issue-key', methods=['GET'])
@login_required
def issue_api_key():
    key = hexlify(os.urandom(current_app.config['API_KEY_LENGTH']))

    if current_user:
        mongo.db.auth.update_one({'email': current_user.email}, {'$set': {'apiKey': key.decode('utf-8')}}, upsert=True)

    return key.decode('utf-8')


@auth.route('/register', methods=['POST'])
def register_user():
    if current_user.is_authenticated:
        return 'already logged in', 403

    form = RegistrationForm(request.form)

    if request.method == 'POST' and form.validate():
        user = {
            'firstName': form.firstName.data,
            'lastName': form.lastName.data,
            'username': form.username.data,
            'email': form.email.data,
            'password': b_crypt.generate_password_hash(form.password.data).decode('utf-8'),
            'apiKey': ''
        }
        mongo.db.auth.save(user)
        return dumps(user), 200


@auth.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return 'already logged in', 403

    form = LoginForm(request.form)
    if request.method == 'POST' and form.validate():
        result = mongo.db.auth.find_one({'email': form.email.data})
        if result and b_crypt.check_password_hash(result['password'], form.password.data):
            user = User(result['username'], result['password'], result['email'],
                        result['firstName'], result['lastName']
                        )
            login_user(user, remember=False)
            return 'logged in', 200
    return 'Username or password does not match!', 400


@auth.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return 'logged out', 200
