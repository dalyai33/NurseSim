
//Types for the quiz props passed in 
interface QuizComponentProps{
    question: string;
    correctAnswer: string;
    wrongOne: string;
    wrongTwo: string;
    wrongThree: string;
}


function QuizComponent({question, correctAnswer, wrongOne, wrongTwo, wrongThree} : QuizComponentProps){
    return(
        <div className="quiz-popup">
            <h1 className="question">{question}</h1>
            <ol>
                <li className="answer">
                    <button>{correctAnswer}</button>
                </li>
                <li className="answer">
                    <button>{wrongOne}</button>
                </li>
                <li className="answer">
                    <button>{wrongTwo}</button>
                </li>
                <li className="answer">
                    <button>{wrongThree}</button>
                </li>
            </ol>
        </div>
        
    );
}

export default QuizComponent;