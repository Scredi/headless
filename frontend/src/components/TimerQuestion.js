import React from 'react'

const TimerQuestion = (props) => {
  const style = {
    animationDuration: `${props.timer}s`
  }

  return (
    <div className="timer-question-container">
      <div className="timer-question" style={style}></div>
    </div>
  )
}

export default TimerQuestion