from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from predict import router

app = FastAPI(title="Genome Disorder Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://genome-disorder-prediction.vercel.app",  # ← your Vercel URL
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
def home():
    return {"message": "Genome Disorder Prediction API is running!"}
