from wtforms import Form, StringField, validators, PasswordField, ValidationError
from flask_app import mongo


class RegistrationForm(Form):
    username = StringField('username', validators=[validators.Length(min=4, max=50), validators.DataRequired()])
    firstName = StringField('firstName', validators=[validators.Length(min=4, max=50), validators.DataRequired()])
    lastName = StringField('lastName', validators=[validators.Length(min=4, max=50), validators.DataRequired()])

    email = StringField('email', validators=[
        validators.Length(min=6, max=35), validators.DataRequired(), validators.Email()
    ])
    password = PasswordField('password', validators=[
        validators.DataRequired(),
        validators.EqualTo('passwordRepeat', message='Passwords must match')
    ])
    passwordRepeat = PasswordField('passwordRepeat')

    def validate_username(self, username):
        result = mongo.db.auth.find_one({'username': username.data})

        if result:
            raise ValidationError('duplicate username')

    def validate_email(self, email):
        result = mongo.db.auth.find_one({'username': email.data})

        if result:
            raise ValidationError('duplicate email')


class LoginForm(Form):
    email = StringField('email', validators=[validators.Length(min=6, max=35), validators.DataRequired()])
    password = PasswordField('password', validators=[validators.DataRequired()])

    def validate_email(self, email):
        result = mongo.db.auth.find_one({'email': email.data})

        if not result:
            raise ValidationError('username or password does not match')
