from flask import Blueprint, request, jsonify, current_app

from flask_app.auth.service import key_required
from flask_app.compute.service import MatLab

compute = Blueprint('compute', __name__)


@compute.route('/api/data/<function_name>', methods=['GET'])
@key_required
def get_octave_data(function_name):
    param_r = request.args.get('r')

    try:
        if not param_r:
            return 'Parameter value r is missing', 400

        r = float(param_r)
        mat_lab = MatLab(current_app.config['MATLAB_FORMULAE_PATH'])

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
    except ValueError:
        return 'Invalid parameter value', 400

    return jsonify(result)


@compute.route('/api/cli', methods=['GET'])
@key_required
def octave_cli():
    commands = request.data

    if commands:
        return MatLab.use_cli(commands.decode('utf-8'))

