
import os, json
import pinecone
from app.core.config import settings

pinecone.init(api_key=settings.PINECONE_API_KEY, environment="gcp-starter")
index_name = "sathelp-memory"
if index_name not in pinecone.list_indexes():
    pinecone.create_index(name=index_name, dimension=1536)
index = pinecone.Index(index_name)

def upsert_embedding(user_id: str, vector: list[float], metadata: dict):
    index.upsert([(f"{user_id}-{metadata.get('id')}", vector, metadata)])

def query_embedding(vector: list[float], top_k=5):
    return index.query(vector, top_k=top_k, include_metadata=True)
