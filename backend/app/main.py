
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routers import auth, chat, essay, quiz, college, scholarship

app = FastAPI(title="SATHELP24x7 API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(chat.router, tags=["chat"])
app.include_router(essay.router, tags=["essay"])
app.include_router(quiz.router, tags=["quiz"])
app.include_router(college.router, tags=["college"])
app.include_router(scholarship.router, tags=["scholarship"])

@app.get("/")
def read_root():
    return {"status": "running"}
