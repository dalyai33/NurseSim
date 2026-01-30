// ChatbotLayout.js
import "../styles/ChatbotLayout.css";

/*
    Use in a simulation page by importing the component, then pasting this
     <div className="chatbot-float">
            <ChatbotComponent/>
      </div>
*/

export default function ChatbotComponent(){
   return(
    
    <div className="chatbot-container">
        <div className="chatbot-header">
            <h3>Help Chat</h3>
        </div>
        
        <div className="message bot">Hello there! I am here to help. Feel free to ask me for hints.</div>
        <div className="message user">Hi, yeah I am kind of confused on what the prefix hemo means, can you help me?</div>
        
        <div className="chatbot-input-area">
            <input type="text" placeholder="Type a question..."/>
            <button>Send</button>
        </div>
    </div>
   );
}


