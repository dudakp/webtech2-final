class User:

    def __init__(self, username, password, email, first_name, last_name, active, logged_in):
        self.username = username
        self.password = password
        self.email = email
        self.first_name = first_name
        self.last_name = last_name
        self.active = active
        self.logged_in = logged_in

    def is_authenticated(self):
        return self.logged_in

    def is_active(self):
        return self.active

    @staticmethod
    def is_anonymous():
        return False

    def get_id(self):
        return self.username.encode('utf-8')
