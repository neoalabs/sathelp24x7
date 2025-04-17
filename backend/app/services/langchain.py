
from langchain.vectorstores import Pinecone as PineconeStore
from langchain.embeddings import OpenAIEmbeddings
from langchain.chains import ConversationalRetrievalChain
from app.core.config import settings
from app.services.pinecone import index

embeddings = OpenAIEmbeddings()  # or Gemini embedding when available
vector_store = PineconeStore(index, embeddings.embed_query, "text")

chain = ConversationalRetrievalChain.from_llm(
    llm=...,  # Placeholder, supply Gemini chat model
    retriever=vector_store.as_retriever(search_kwargs={"k": 4}),
)
