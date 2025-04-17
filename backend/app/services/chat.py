from fastapi import Depends
from app.services.gemini import generate_response
from app.services.pinecone import upsert_embedding, query_embedding
from app.core.auth import get_current_user
from app.db.models import User
import json
import uuid
import time

class ChatService:
    def __init__(self):
        self.embedding_cache = {}  # Cache for temporary storage
    
    async def get_chat_response(self, user: User, message: str):
        # 1. Create context from previous interactions
        context = await self._get_context(user.id, message)
        
        # 2. Generate complete prompt with context
        prompt = f"""As an SAT tutor helping a student prepare for their exam. 
        
Previous context: {context}

Student question: {message}

Please provide a helpful, educational response that will help the student understand the concept and improve their SAT preparation.
"""
        
        # 3. Get response from Gemini
        response = await generate_response(prompt)
        
        # 4. Store the interaction
        await self._store_interaction(user.id, message, response)
        
        return response
    
    async def _get_context(self, user_id: int, current_message: str):
        # This would normally use embeddings to retrieve similar context
        # For now, simplified to just return the last few interactions
        try:
            results = query_embedding(
                vector=[0] * 1536,  # Placeholder for actual embedding
                top_k=3
            )
            
            # Format previous interactions
            context = []
            for match in results.get("matches", []):
                metadata = match.get("metadata", {})
                if metadata.get("user_id") == str(user_id):
                    context.append(f"Q: {metadata.get('message', '')}")
                    context.append(f"A: {metadata.get('response', '')}")
            
            return "\n".join(context)
        except Exception as e:
            print(f"Error retrieving context: {e}")
            return ""
    
    async def _store_interaction(self, user_id: int, message: str, response: str):
        # In production, this would actually compute embeddings and store in Pinecone
        interaction_id = str(uuid.uuid4())
        metadata = {
            "id": interaction_id,
            "user_id": str(user_id),
            "message": message,
            "response": response,
            "timestamp": time.time()
        }
        
        # Placeholder for actual embedding
        vector = [0] * 1536  
        
        try:
            upsert_embedding(str(user_id), vector, metadata)
        except Exception as e:
            print(f"Error storing interaction: {e}")
            # Cache locally if Pinecone fails
            self.embedding_cache[interaction_id] = (vector, metadata)

chat_service = ChatService()

async def get_chat_service():
    return chat_service