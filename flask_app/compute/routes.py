from datetime import datetime
from pathlib import Path

from flask import Blueprint, request, jsonify, current_app, send_file, render_template
from flask_babel import gettext
from flask_mail import Message
from oct2py import Oct2PyError

from flask_app import config
from flask_app import mongo, mail
from flask_app.auth.service import key_required
from flask_app.compute.service import MatLab
from flask_app.util.export import DBExporter
from flask_app.util.logger import Logger

compute = Blueprint('compute', __name__)
logger = Logger(mongo.db, 'log')


@compute.route('/api/data/<function_name>', methods=['GET'])
@key_required
def get_octave_data(function_name):
    param_r = request.args.get('r')
    param_init1 = request.args.get('init1')
    param_init2 = request.args.get('init2')
    try:
        if not param_r:
            return 'Parameter value r is missing', 400

        r = float(param_r)

        if not param_init1:
            param_init1 = 0
        if not param_init2:
            param_init2 = 0

        init1 = float(param_init1)
        init2 = float(param_init2)

        mat_lab = MatLab(current_app.config['MATLAB_FORMULAE_PATH'])
        result = None
        try:
            if function_name == 'plane':
                result = mat_lab.compute_plane_data(r, init1, init2)
            elif function_name == 'ball':
                result = mat_lab.compute_ball_data(r, init1, init2)
            elif function_name == 'suspension':
                result = mat_lab.compute_suspension_data(r, init1, init2)
            elif function_name == 'pendulum':
                result = mat_lab.compute_pendulum_data(r, init1, init2)
            else:
                return f'Matlab function name {function_name} not found', 400

            logger.log(function_name + f'(r={r})', datetime.utcnow(), 'SUCCESS')
        except Oct2PyError as e:
            logger.log(function_name + f'(r={r})', datetime.utcnow(), 'ERROR', str(e))
    except ValueError:
        return 'Invalid parameter value', 400
    if result:
        return jsonify(result)


@compute.route('/api/cli', methods=['POST'])
@key_required
def octave_cli():
    commands = request.data
    if commands:
        try:
            result = str(MatLab.use_cli(commands.decode('utf-8')))
            logger.log(commands.decode('utf-8'), datetime.utcnow(), 'SUCCESS')
            return result
        except Oct2PyError as e:
            logger.log(commands.decode('utf-8'), datetime.utcnow(), 'ERROR', str(e))
            return str(e), 400
    else:
        return 'No commands inserted in body', 400


@compute.route('/api/export/csv', methods=['GET'])
@key_required
def csv_export():
    exporter = DBExporter(mongo.db, 'log')
    exporter.all_to_csv()
    return send_file(str(Path(__file__).parent.absolute()) + '/../static/export.csv', 'export.csv')


@compute.route('/api/export/pdf', methods=['GET'])
@key_required
def pdf_export():
    exporter = DBExporter(mongo.db, 'log')
    exporter.all_to_pdf()
    return send_file(str(Path(__file__).parent.absolute()) + '/../static/export.pdf', 'export.pdf')


# @compute.route('/api/export/stat', methods=['GET'])
# @key_required
# def stat_export():
#     exporter = DBExporter(mongo.db, 'log')
#     return exporter.compute_stats()
#     # return send_file(str(Path(__file__).parent.absolute()) + '/../static/stat.pdf', 'stat.pdf')

@compute.route('/mail')
@key_required
def send_mail():
    recipient = request.args.get('email')
    pdf = request.args.get('pdf') == 'true'
    csv = request.args.get('csv') == 'true'

    exporter = DBExporter(mongo.db, 'log')
    msg = Message(subject=gettext(u'Export štatistík z aplikácie Octavia Proxy'),
                  recipients=[recipient])
    msg.html = render_template('email-template.html')
    if pdf:
        exporter.all_to_pdf()
        with open(config['STATIC_PATH'] + 'stats.pdf', 'rb') as fp:
            msg.attach("statistics.pdf", "application/pdf", fp.read())
    if csv:
        exporter.all_to_csv()
        with open(config['STATIC_PATH'] + 'export.csv', 'rb') as fp:
            msg.attach("statistics.csv", "text/csv", fp.read())
    mail.send(msg)

    return 'success'
