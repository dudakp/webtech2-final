from flask import Blueprint, request, jsonify, current_app
from oct2py import Oct2PyError
from datetime import datetime

from flask_app import mongo
from flask_app.auth.service import key_required
from flask_app.compute.service import MatLab
from flask_app.util.logger import Logger

compute = Blueprint('compute', __name__)
logger = Logger(mongo.db, 'log')


@compute.route('/api/data/<function_name>', methods=['GET'])
@key_required
def get_octave_data(function_name):
    param_r = request.args.get('r')

    try:
        if not param_r:
            return 'Parameter value r is missing', 400

        r = float(param_r)
        mat_lab = MatLab(current_app.config['MATLAB_FORMULAE_PATH'])
        result = None
        try:
            if function_name == 'plane':
                result = mat_lab.compute_plane_data(r)
            elif function_name == 'ball':
                result = mat_lab.compute_ball_data(r)
            elif function_name == 'suspension':
                result = mat_lab.compute_suspension_data(r)
            elif function_name == 'pendulum':
                result = mat_lab.compute_pendulum_data(r)
            else:
                return f'Matlab function name {function_name} not found', 400

            logger.log(function_name + f'(r={r})', datetime.utcnow(), 'SUCCESS')
        except Oct2PyError as e:
            logger.log(function_name + f'(r={r})', datetime.utcnow(), 'ERROR', str(e))
    except ValueError:
        return 'Invalid parameter value', 400
    if result:
        return jsonify(result)


@compute.route('/api/cli', methods=['GET'])
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
            return 'Invalid statement(s)', 400
