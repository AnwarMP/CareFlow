from fastapi import FastAPI
from pydantic import BaseModel
from app.agents import oncall_agent

app = FastAPI()

class Query(BaseModel):
    question: str

@app.post("/")
async def handle(query: Query):
    answer = oncall_agent(query.question)
    return {"answer": answer}
