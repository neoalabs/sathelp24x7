<<<<<<< HEAD
# sathelp24x7
=======

# SATHELP24x7

End-to-end AI-powered SAT preparation platform scaffold.

## Stack

* **Backend**: FastAPI, PostgreSQL, Pinecone, LangChain, Gemini APIs  
* **Frontend**: React.js (Vite) + TailwindCSS  
* **Auth**: JWT  
* **Deployment**: Docker Compose  

## Quick Start

```bash
git clone <repo>
cd SATHELP24x7
cp .env.example .env  # add your keys
docker-compose up --build
```

Frontend: http://localhost:5173  
Backend: http://localhost:8000  

## Tests

```bash
docker-compose exec backend pytest
```

## Next Steps

* Flesh out endpoint logic  
* Integrate real quiz questions and essay prompts  
* Implement adaptive learning algorithm in backend  
* Build protected routes and state management on frontend  
* Add CI/CD workflow  
```
>>>>>>> d7650aa (Initial commit)
