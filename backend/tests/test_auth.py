import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_register():
    # Use random email to avoid conflicts in repeat test runs
    import random
    test_email = f"test{random.randint(1000, 9999)}@example.com"
    
    response = client.post(
        "/auth/register",
        json={"email": test_email, "password": "testpassword"}
    )
    assert response.status_code == 200
    assert response.json() == {"msg": "registered"}

def test_login():
    # First register a test user
    test_email = "testlogin@example.com"
    test_password = "testpassword"
    
    # Register (this may fail if the user already exists, which is fine for this test)
    client.post(
        "/auth/register",
        json={"email": test_email, "password": test_password}
    )
    
    # Now try to login
    response = client.post(
        "/auth/login",
        data={"username": test_email, "password": test_password}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"

def test_login_invalid_credentials():
    response = client.post(
        "/auth/login",
        data={"username": "nonexistent@example.com", "password": "wrongpassword"}
    )
    assert response.status_code == 401