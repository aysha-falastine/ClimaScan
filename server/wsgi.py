# wsgi.py
import os
from app import create_app
from config import config

# Use production config by default, or based on FLASK_ENV
env = os.getenv('FLASK_ENV', 'production')
app = create_app(config.get(env, config['production']))
