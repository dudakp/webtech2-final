from flask import Blueprint, jsonify, session, redirect
from flask_login import login_required, current_user

user = Blueprint('user', __name__)


@user.route('/profile')
@login_required
def profile():
    return jsonify(vars(current_user))


@user.route('/language/<language>')
def set_language(language=None):
    session['language'] = language
    return redirect('/')
