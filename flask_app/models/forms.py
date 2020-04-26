from wtforms import Form, StringField, PasswordField, validators


class RegistrationForm(Form):
    username = StringField('username', [validators.Length(min=4, max=50), validators.DataRequired()])
    firstName = StringField('firstName', [validators.Length(min=4, max=50), validators.DataRequired()])
    lastName = StringField('lastName', [validators.Length(min=4, max=50), validators.DataRequired()])

    email = StringField('email', [validators.Length(min=6, max=35), validators.DataRequired()])
    password = PasswordField('password', [
        validators.DataRequired(),
        validators.EqualTo('passwordRepeat', message='Passwords must match')
    ])
    passwordRepeat = PasswordField('passwordRepeat')


class LoginForm(Form):
    username = StringField('username', [validators.Length(min=4, max=50), validators.DataRequired()])
    password = PasswordField('password', [validators.DataRequired()])
