from app import create_app

app = create_app()

# Add a test route at the root URL
@app.route('/')
def home():
    return {'message': 'Welcome to ClimaScan API'}, 200

if __name__ == "__main__":
    app.run(debug=True)
