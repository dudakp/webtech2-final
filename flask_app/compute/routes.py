from flask import Blueprint, request, jsonify, current_app
from oct2py import octave

from flask_app import mongo

compute = Blueprint('compute', __name__)


@compute.route('/api/data/<function_name>')
def get_octave_data(function_name):
    octave.cd(current_app.config['MATLAB_FORMULAE_PATH'])
    param_r = request.args.get('r')
    api_key = request.args.get('key')

    if api_key:
        if not mongo.db.auth.find_one({'apiKey': api_key}):
            return 'Invalid API key', 403

    try:
        if not param_r:
            return 'Parameter value r is missing', 400

        r = float(param_r)

        if function_name == 'plane':
            arr = octave.plane(r).tolist()
        elif function_name == 'ball':
            arr = octave.ball(r).tolist()
        elif function_name == 'suspension':
            arr = octave.suspension(r).tolist()
        elif function_name == 'pendulum':
            arr = octave.pendulum(r).tolist()
        else:
            return f'Matlab function name {function_name} not found', 400
    except ValueError:
        return 'Invalid parameter value', 400

    return jsonify(arr)
