from flask import Blueprint, render_template
from flask_login import login_required

view = Blueprint('view', __name__)


@view.route('/')
@login_required
def profile():
    return render_template('index.jinja2')
