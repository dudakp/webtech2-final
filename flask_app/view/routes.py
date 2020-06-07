from flask import Blueprint, render_template
from flask_login import login_required
from flask_app.util.export import DBExporter
from flask_app import mongo


view = Blueprint('view', __name__)


@view.route('/')
@login_required
def profile():
    return render_template('index.jinja2')


@view.route('/terminal')
@login_required
def console():
    return render_template('terminal.jinja2')


@view.route('/stats')
@login_required
def stats():
    exporter = DBExporter(mongo.db, 'log')
    return render_template('stats.jinja2', stats=exporter.compute_stats())
