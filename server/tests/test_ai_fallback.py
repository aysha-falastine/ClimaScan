import pytest

from app import create_app


@pytest.fixture
def app():
    app = create_app()
    return app


def test_generate_report_uses_fallback_when_hf_fails(monkeypatch, app):
    # Arrange: force HuggingFaceService.generate_climate_report to raise
    from app.services.ai_service import HuggingFaceService

    def _raise(self, prop):
        raise RuntimeError("HF down")

    monkeypatch.setattr(HuggingFaceService, 'generate_climate_report', _raise)

    with app.app_context():
        client = app.test_client()
        # login as seeded user
        resp = client.post('/api/users/login', json={'email': 'test@example.com', 'password': 'password'})
        assert resp.status_code == 200
        token = resp.get_json().get('access_token')
        headers = {'Authorization': f'Bearer {token}'}

        # Act: generate report
        r = client.post('/api/reports/property/1/generate', headers=headers)

        # Assert
        assert r.status_code == 201
        data = r.get_json()
        assert 'report' in data
        assert data['report'].get('ai_source') == 'fallback'
        assert 'ai_summary' in data['report']
