// ChatbotLayout.js
import "../styles/ChatbotLayout.css";

import {useState} from "react";

/*
    Use in a simulation page by importing the component, then pasting this
     <div className="chatbot-float">
            <ChatbotComponent/>
      </div>
*/

export default function ChatbotComponent(){
   const [input, setInput] = useState("");
   const [messages, setMessages] = useState([
    {sender:"bot", text:"Hello there! I am here to help. Feel Free to ask me for hints."}
   ]);

   const sendMessage = async () => {
        if(!input.trim()) return;
        //ade user message
        const userMessage = {sender: "user", text: input};
        setMessages(prev=>[...prev, userMessage]);
        setInput("");

        try{
            const res = await fetch("http://127.0.0.1:5001/api/chat", {
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({message:input})
            });

            const data = await res.json();

            const botReply = {
                sender:"bot",
                text: data["reply: "] || "I could not generate a hint."
            };

            setMessages(prev => [...prev, botReply]);
        } catch(err){
            console.error(err);
            setMessages(prev => [
                ...prev,
                {sender: "bot", text: "Backend connection error."}
            ]);
        }
   };
   
    return(
    
    <div className="chatbot-container">
        <div className="chatbot-header">
            <h3>Help Chat</h3>
        </div>
        
        {messages.slice(-3).map((msg, index)=>(
            <div key={index} className={`message ${msg.sender}`}>
                {msg.text}
            </div>
        ))}
        
        <div className="chatbot-input-area">
            <input type="text" 
            placeholder="Type a question..."
            value={input}
            onChange={(e)=>setInput(e.target.value)}
            onKeyDown={(e)=>e.key === "Enter" && sendMessage()}/>
            <button onClick={sendMessage}>Send</button>
        </div>
    </div>
   );
}


