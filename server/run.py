from app import create_app
from config import config  # ✅ CORRECT

app = create_app(config['development'])  # ✅ use the development config class

@app.route('/')
def home():
    return {'message': 'ClimaScan API is running'}

if __name__ == "__main__":
    app.run(debug=True)
