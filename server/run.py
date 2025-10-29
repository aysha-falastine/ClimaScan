from app import create_app
from config import config

app = create_app(config['development'])

@app.route('/')
def home():
    return {'message': 'ClimaScan API is running'}

if __name__ == "__main__":
    app.run(debug=True)
