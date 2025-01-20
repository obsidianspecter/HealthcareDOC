from fastapi import FastAPI
from pydantic import BaseModel
import ollama
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    user_input: str

chat_history = [{"role": "assistant", "content": "How can I help you?"}]

@app.post("/chat")
async def chat(request: ChatRequest):
    global chat_history
    chat_history.append({"role": "user", "content": request.user_input})

    response = ollama.chat(model='WDOC', messages=chat_history)
    chat_history.append({"role": "assistant", "content": response['message']['content']})

    return {"response": response['message']['content']}
