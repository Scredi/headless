import React from 'react'

const Question = (props) => {
  return (
    <div className="question-item">
      <h4>{props.data.question}</h4>
      {
        props.data.reponses.map((reponse, index) => {
          return <p key={index}>{reponse}</p>
        })
      }
    </div>
  )
}

export default Question