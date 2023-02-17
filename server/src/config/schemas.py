from pydantic import BaseSettings


class Settings(BaseSettings):
    authjwt_secret_key: str

    mail_username: str
    mail_password: str
    mail_from: str
    mail_port: int
    mail_server: str
    mail_from_name: str = 'Sabawoon Enayat'

    class Config:
        env_file = '.env'

