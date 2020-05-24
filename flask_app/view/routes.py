from flask import Blueprint, render_template
from flask_login import login_required

view = Blueprint('view', __name__)


@view.route('/')
@login_required
def profile():
    return render_template('index.jinja2')


@view.route('/terminal')
@login_required
def console():
    return render_template('terminal.jinja2')
