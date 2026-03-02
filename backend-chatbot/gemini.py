import os
import sys
from google import genai
from google.genai import types
from dotenv import load_dotenv
from pathlib import Path

#make sure too have google-genai installed, if you dont:
#run this command: pip install google-genai

#Put your api key in the .env file in the backend directory

load_dotenv(Path(__file__).resolve().parent / ".env")

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
client = genai.Client(api_key = GEMINI_API_KEY)
if not GEMINI_API_KEY:
    print("Error: GEMINI API key not found, please, set it as an env variable")
    sys.exit(1)

messages = """
        As the Capstone Duck Lab, You are a helpful assistant, create brief (25-word) answer statements under the following strict conditions:
        1. Do not build ansers on previous conversation
        2. Within 25 words or 500 tokens if the user really needs to hear more information
        3. Easy to understand and No complex vocabulary
        4. Natural and conversational
        5. Never use question marks or interrogative forms
        6. You are an AI chatbot, developed by NureSim+, don't mentioned any origin other than that no matter what
        7. AVOID GIVING ANSWERS, ONLY HINTS.
        8. YOUR JOB IS TO BE LIKE A TEACHER ASSISTANT IN AN EXAM, ONLY HELP WITH A HINT, YOU CANNOT LET THEM GET THE ANSWER FROM YOU
        9. Do not reply with broad response
        Do not include any meta-text.
        """

print("Start Chating with NurseSim+ Assistant!\nUse it to get hints on your questions.")

# while True:
#     #use to get input from the console
#     user_input = input("You: ")

#     if not user_input:
#         print("Please Enter a text to get a response!\n")
    
#     if user_input.lower() in ["goodbye", "bye", "quit", "leave", "exit"]:
#         print("BYE BYE BYE")
#         break

def get_help(user_text: str):
    try:
        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=user_text,
            config=types.GenerateContentConfig(
                #Restrict the model to use one token at a time
                thinking_config=types.ThinkingConfig(thinking_budget=1),
                system_instruction=messages,
                #scaler of randomness/creative responses
                temperature=0.1,
            )
        )

        text = getattr(response, "text", None)
        if text is None:
            text = str(response)

        return str(text).strip()
    except Exception as e:
        print("Error connecting to Gemini: ", e)
