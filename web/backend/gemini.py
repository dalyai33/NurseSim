import os
from google import genai
from google.genai import types

#make sure too have google-genai installed, if you dont:
#run this command: pip install google-genai

#Put your api key in the .env file in the backend directory
client = genai.Client(api_key = os.getenv('GEMINI_API_KEY'))

#use to get input from the console
user_input = input("Hello there, I am Capstone. I am your here for you if you need any help with a question: \n")

response = client.models.generate_content(
    model="gemini-3-flash-preview",
    contents=user_input,
    config=types.GenerateContentConfig(
        #Restrict the model to use one token at a time
        thinking_config=types.ThinkingConfig(thinking_budget=1),
        system_instruction="You are a tutor for nursing students. You must not respond with the answer to the question they ask, but must give hits instead.",
        #scaler of randomness/creative responses
        temperature=0.1,
    )
)
print("\n")

print(response.text)
