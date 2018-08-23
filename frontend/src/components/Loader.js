import React, { Component } from 'react'
import Loader from 'react-loader-spinner'

class CustomLoader extends Component {
  render() {
    return (
      <div className="loader-container">
        <Loader
          type="ThreeDots"
          color="#ffff"
          height="100"
          width="100"
        />
      </div>
    )
  }
}

export default CustomLoader