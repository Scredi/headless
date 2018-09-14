import React from 'react'

const Timer = (props) => {
  const style = {
    animationDuration: `${props.timer}s`
  }
  return (
    <div className="timer-container">
      <div className="timer" style={style}></div>
    </div>
  )
}

export default Timer