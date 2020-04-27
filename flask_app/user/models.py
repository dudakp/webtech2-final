from flask_login import UserMixin

from flask_app import login_manager, mongo


class User(UserMixin):

    def __init__(self, username, password, email, first_name, last_name):
        self.username = username
        self.password = password
        self.email = email
        self.first_name = first_name
        self.last_name = last_name

    def get_id(self):
        return self.username


@login_manager.user_loader
def load_user(user_id):
    found = mongo.db.auth.find_one({'username': user_id})
    return User(found['username'], found['password'], found['email'],
                found['firstName'], found['lastName']
                )
