from flask import Flask
from app.routes.auth import auth_bp
from app.routes.users import users_bp
from app.routes.reports import reports_bp
#from app.routes.properties import properties_bp
#from app.routes.climate import climate_bp
from app.routes.ai_chat import ai_bp

def create_app():
    app = Flask(__name__)

    # ✅ Register blueprints with API prefixes to match your frontend
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(reports_bp, url_prefix='/api/reports')
    #app.register_blueprint(properties_bp, url_prefix='/api/properties')
    #app.register_blueprint(climate_bp, url_prefix='/api/climate')
    app.register_blueprint(ai_bp, url_prefix='/api/ai')

    # ✅ Add a root route to avoid 404 on "/"
    @app.route('/')
    def index():
        return {'message': '✅ ClimaScan API is running successfully!'}, 200

    return app
