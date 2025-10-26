from app import create_app

app = create_app()

# ✅ Add this route to test your API base URL
@app.route('/')
def home():
    return {'message': 'ClimaScan API is running'}

if __name__ == "__main__":
    app.run(debug=True)
