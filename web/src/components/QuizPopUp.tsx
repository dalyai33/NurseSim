import { useState } from "react";

//Types for the quiz props passed in 
interface QuizComponentProps{
    question: string;
    correctAnswer: string;
    wrongOne: string;
    wrongTwo: string;
    wrongThree: string;
}



function QuizComponent({question, correctAnswer, wrongOne, wrongTwo, wrongThree} : QuizComponentProps){
    
    //States for the popup
    const [showPopup, setShowPopup] = useState(false);

    function handleCorrect(){
        
    }

    function handleWrong(){
        //show the incorrect popup
        setShowPopup(true);
    }  

    
    return(
        <div className="quiz-popup">

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-box">
                        <h2>Incorrect!</h2>
                        <button onClick={() => setShowPopup(false)}>
                            Close
                        </button>
                    </div>
                </div>
            )}


            <h1 className="question">{question}</h1>
            <ol>
                <li className="answer">
                    <button onClick={handleCorrect}>{correctAnswer}</button>
                </li>
                <li className="answer">
                    <button onClick={handleWrong}>{wrongOne}</button>
                </li>
                <li className="answer">
                    <button onClick={handleWrong}>{wrongTwo}</button>
                </li>
                <li className="answer">
                    <button onClick={handleWrong}>{wrongThree}</button>
                </li>
            </ol>
        </div>
        
    );
}

export default QuizComponent;