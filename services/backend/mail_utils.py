from flask_mail import Mail, Message

def init_mail(app):
    mail = Mail(app)
    return mail

def enviar_correo(mail, destinatario, asunto, cuerpo):
    msg = Message(asunto, recipients=[destinatario])
    msg.body = cuerpo
    mail.send(msg)
