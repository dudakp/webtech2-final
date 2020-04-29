class Singleton(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]


class Logger(metaclass=Singleton):

    def __init__(self, db, collection_name):
        self.db = db[collection_name]

    def log(self, cmd: str, date, result: str, info=None):
        log_entry = {
            'command': cmd,
            'timestamp': date,
            'result': result,
            'info': info
        }
        self.db.insert_one(log_entry)
