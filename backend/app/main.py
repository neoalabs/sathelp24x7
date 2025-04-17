from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routers import auth, chat, essay, quiz, college, scholarship
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.openapi.utils import get_openapi

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
    return {"status": "running", "app": "SATHELP24x7", "version": "0.1.0"}

# Custom OpenAPI documentation
@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url="/openapi.json",
        title="SATHELP24x7 API Documentation",
        swagger_js_url="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui-bundle.js",
        swagger_css_url="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui.css",
    )

@app.get("/openapi.json", include_in_schema=False)
async def get_open_api_endpoint():
    return get_openapi(
        title="SATHELP24x7 API",
        version="0.1.0",
        description="API documentation for the SATHELP24x7 platform",
        routes=app.routes,
    )