import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# Helper function to get auth token
def get_auth_token():
    # First register a test user
    test_email = "testquiz@example.com"
    test_password = "testpassword"
    
    # Try to register (may fail if user exists, which is fine)
    client.post(
        "/auth/register",
        json={"email": test_email, "password": test_password}
    )
    
    # Now login to get token
    response = client.post(
        "/auth/login",
        data={"username": test_email, "password": test_password}
    )
    return response.json()["access_token"]

def test_list_quizzes():
    token = get_auth_token()
    
    response = client.get(
        "/quizzes",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    
    # Check the structure of the response
    if len(response.json()) > 0:
        quiz = response.json()[0]
        assert "id" in quiz
        assert "topic" in quiz
        assert "difficulty" in quiz

def test_get_quiz_not_found():
    token = get_auth_token()
    
    response = client.get(
        "/quiz/9999", # Use an ID that likely doesn't exist
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 404