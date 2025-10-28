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
        # create a user
        u = User(email='pytest@example.com')
        u.set_password('Password1')
        _db.session.add(u)
        _db.session.commit()

    yield app

    # teardown
    with app.app_context():
        _db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()


def test_properties_crud(client):
    # login to get token
    rv = client.post('/api/users/login', json={'email':'pytest@example.com','password':'Password1'})
    assert rv.status_code == 200
    data = rv.get_json()
    token = data['access_token']

    headers = { 'Authorization': f'Bearer {token}' }

    # create property
    rv = client.post('/api/properties/', json={'name':'T1','location':'L1','date_added':'2025-10-28'}, headers=headers)
    assert rv.status_code == 201
    p = rv.get_json()
    assert p['name'] == 'T1'

    # list properties
    rv = client.get('/api/properties/', headers=headers)
    assert rv.status_code == 200
    data = rv.get_json()
    assert data['total'] >= 1
