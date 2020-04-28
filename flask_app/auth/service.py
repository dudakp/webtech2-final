from flask import request
from functools import wraps

from flask_app import mongo


def key_required(func):
    @wraps(func)
    def wrapper_decorator(*args, **kwargs):
        api_key = request.args.get('key')

        if not api_key:
            return 'Missing API key', 403

        if not mongo.db.auth.find_one({'apiKey': api_key}):
            return 'Invalid API key', 403
        else:
            return func(*args, **kwargs)
    return wrapper_decorator
