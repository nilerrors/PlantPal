from src import config
from fastapi import BackgroundTasks
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig


settings = config.Settings()

conf = ConnectionConfig(
	MAIL_USERNAME=settings.mail_username,
	MAIL_PASSWORD=settings.mail_password,
	MAIL_FROM=settings.mail_from,
	MAIL_PORT=settings.mail_port,
	MAIL_SERVER=settings.mail_server,
	MAIL_FROM_NAME=settings.mail_from_name,
	MAIL_STARTTLS=True,
	MAIL_SSL_TLS=False,
	USE_CREDENTIALS=True,
	TEMPLATE_FOLDER='./src/templates/email'
)


async def send_email_async(subject: str, email_to: str, body: dict, template_name: str = 'email.html'):
	message = MessageSchema(
		subject=subject,
		recipients=[email_to],
		template_body=body,
		subtype='html',
	)

	fm = FastMail(conf)
	await fm.send_message(message, template_name=template_name)
