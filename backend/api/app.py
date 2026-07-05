import os
import uuid
import asyncio
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from google.adk.runners import InMemoryRunner
from google.genai import types
from api.adk_agent import root_agent, analyze_field_image

app = FastAPI(title="AROGYA-DI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

runner = InMemoryRunner(agent=root_agent, app_name="arogya_di")


@app.get("/")
def root():
    return {"status": "AROGYA-DI backend is running"}


@app.post("/api/chat")
async def chat(payload: dict):
    question = payload.get("message", "")
    user_id = payload.get("user_id", "demo_user")
    session_id = payload.get("session_id", str(uuid.uuid4()))

    await runner.session_service.create_session(
        app_name="arogya_di", user_id=user_id, session_id=session_id
    )

    content = types.Content(role="user", parts=[types.Part(text=question)])

    final_text = ""
    async for event in runner.run_async(
        user_id=user_id, session_id=session_id, new_message=content
    ):
        if event.is_final_response() and event.content and event.content.parts:
            final_text = event.content.parts[0].text

    return {"answer": final_text}


@app.post("/api/upload")
async def upload_image(file: UploadFile = File(...)):
    contents = await file.read()
    result = analyze_field_image(contents, file.content_type)
    return {"result": result}

@app.post("/api/transcribe")
async def transcribe(file: UploadFile = File(...)):
    from api.adk_agent import transcribe_citizen_call
    contents = await file.read()
    result = transcribe_citizen_call(contents)
    return {"transcript": result}