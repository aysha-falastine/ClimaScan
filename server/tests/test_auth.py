import pytest
from app import create_app
from app.database.db import db as _db
from app.models.user import User

@pytest.fixture
def app():
    app = create_app()
    app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        "JWT_IDENTITY_CLAIM": "identity",
    })

    with app.app_context():
        _db.create_all()
        yield app
        _db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

def test_signup_success(client):
    """Test successful user registration"""
    response = client.post('/api/users/signup', json={
        'name': 'Test User',
        'email': 'test@example.com',
        'password': 'StrongPass123'
    })
    assert response.status_code == 201
    data = response.get_json()
    assert data['message'] == 'User registered successfully'

def test_signup_missing_fields(client):
    """Test signup with missing required fields"""
    response = client.post('/api/users/signup', json={
        'email': 'test@example.com'
    })
    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data

def test_signup_weak_password(client):
    """Test signup with weak password"""
    response = client.post('/api/users/signup', json={
        'name': 'Test User',
        'email': 'test@example.com',
        'password': 'weak'
    })
    assert response.status_code == 400
    data = response.get_json()
    assert 'Weak password' in data['error']

def test_login_success(client):
    """Test successful login"""
    # First create a user
    client.post('/api/users/signup', json={
        'name': 'Test User',
        'email': 'login@example.com',
        'password': 'StrongPass123'
    })
    
    # Then login
    response = client.post('/api/users/login', json={
        'email': 'login@example.com',
        'password': 'StrongPass123'
    })
    assert response.status_code == 200
    data = response.get_json()
    assert 'access_token' in data

def test_login_wrong_password(client):
    """Test login with wrong password"""
    # Create user
    client.post('/api/users/signup', json={
        'name': 'Test User',
        'email': 'user@example.com',
        'password': 'StrongPass123'
    })
    
    # Try wrong password
    response = client.post('/api/users/login', json={
        'email': 'user@example.com',
        'password': 'WrongPassword123'
    })
    assert response.status_code == 401
    data = response.get_json()
    assert 'error' in data