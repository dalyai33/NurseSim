import os
from google import genai
from google.genai import types

#make sure too have google-genai installed, if you dont:
#run this command: pip install google-genai

#Put your api key in the .env file in the backend directory
client = genai.Client(api_key = os.getenv('GEMINI_API_KEY'))


messages=[
    {"role": "system", "content":f"""
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
        """}
]

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
