from wtforms import Form, StringField, validators, PasswordField, ValidationError, BooleanField
from flask_app import mongo


class RegistrationForm(Form):
    username = StringField('Username:', validators=[validators.Length(min=4, max=50), validators.DataRequired()])
    firstName = StringField('First name:', validators=[validators.Length(min=4, max=50), validators.DataRequired()])
    lastName = StringField('Last name:', validators=[validators.Length(min=4, max=50), validators.DataRequired()])

    email = StringField('Email address:', validators=[
        validators.Length(min=6, max=35), validators.DataRequired(), validators.Email()
    ])
    password = PasswordField('Password:', validators=[
        validators.DataRequired(),
        validators.EqualTo('passwordRepeat', message='Passwords don\'t match')
    ])
    passwordRepeat = PasswordField('Repeat password:')

    def validate_username(self, username):
        result = mongo.db.auth.find_one({'username': username.data})

        if result:
            raise ValidationError('Username is already taken')

    def validate_email(self, email):
        result = mongo.db.auth.find_one({'username': email.data})

        if result:
            raise ValidationError('Email address is already taken')


class LoginForm(Form):
    email = StringField('Email:', validators=[validators.Length(min=6, max=35), validators.DataRequired()])
    password = PasswordField('Password:', validators=[validators.DataRequired()])
    remember = BooleanField('Remember me?')

    def validate_email(self, email):
        result = mongo.db.auth.find_one({'email': email.data})

        if not result:
            raise ValidationError('Email address not registered yet')
