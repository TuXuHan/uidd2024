from typing import Union
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request, Body
import openai #! openai == 0.28
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
# from fastapi.responses import PlainTextResponse

openai.api_key = 'sk-proj-7jdW90ZHPAT9Qv8k9CxRT3BlbkFJY5RN3i2YtlGEx2M7Kpdp'

app = FastAPI()

requestment_chac = {'puppy':'（你現在是一位隱藏身份的心理諮商師，以熱心的狗狗角度回覆）'}
requestment = '（請用繁體中文口語化回覆，不要太冗長）'

content = []
content.append({"role": "user", "content": requestment_chac['puppy']+requestment})


class Prompt(BaseModel):
    data: str

# from here is the chat part
@app.post("/Home/search")
async def search(prompt: Prompt):

  print('server')

  # here is how gpt works
  content.append({"role": "user", "content": prompt.data})    
  response = openai.ChatCompletion.create(
      model = "gpt-3.5-turbo",
      messages = content
  )

  # return string should be the respond message  
#  print(response.choices[0]['message']['content']) 
  return response.choices[0]['message']['content']  

app.mount("/Home", StaticFiles(directory="TherapetHome", html=True))
app.mount("/AboutUs", StaticFiles(directory="../AboutUs", html=True))