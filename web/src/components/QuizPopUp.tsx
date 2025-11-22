function QuizComponent(){
    return(
        <div className="quiz-popup">
            <h1 className="question">What does the prefix 'hemo-' correlate with?</h1>
            <ol>
                <li className="answer">
                    <button>Blood</button>
                </li>
                <li className="answer">
                    <button>Liver</button>
                </li>
                <li className="answer">
                    <button>Bone</button>
                </li>
                <li className="answer">
                    <button>Skin</button>
                </li>
            </ol>
        </div>
        
    )
}

export default QuizComponent