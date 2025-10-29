import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Base directory
basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    # Fix: Filter out empty strings from CORS_ORIGINS
    _cors_origins_raw = os.getenv("CORS_ORIGINS", "")
    CORS_ORIGINS = [origin.strip() for origin in _cors_origins_raw.split(",") if origin.strip()]

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        f"sqlite:///{os.path.join(basedir, 'instance', 'dev.db')}"
    )

class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        f"sqlite:///{os.path.join(basedir, 'instance', 'prod.db')}"
    )

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
