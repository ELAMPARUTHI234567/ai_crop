from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "service": "CropDoc AI API"}

def test_metrics_no_model():
    response = client.get("/api/model/metrics")
    assert response.status_code == 200
    assert "accuracy" in response.json()
