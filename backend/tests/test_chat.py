import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from app.main import app
from app.services.chat import ChatService

client = TestClient(app)

# Helper function to get auth token
def get_auth_token():
    # First register a test user
    test_email = "testchat@example.com"
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

@patch('app.services.chat.ChatService.get_chat_response')
def test_chat(mock_get_chat_response):
    # Mock the chat service response
    mock_get_chat_response.return_value = "This is a test response"
    
    # Get auth token
    token = get_auth_token()
    
    # Make chat request
    response = client.post(
        "/chat",
        json={"message": "Hello, can you help me with SAT math?"},
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    assert response.json() == {"reply": "This is a test response"}
    
def test_chat_unauthorized():
    response = client.post(
        "/chat",
        json={"message": "Hello, can you help me with SAT math?"}
    )
    assert response.status_code == 401