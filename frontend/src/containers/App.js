import React, { Component } from 'react'
import axios from 'axios'
import Question from '../components/Question'
import CustomLoader from '../components/Loader'
import TimerQuestion from '../components/TimerQuestion'

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      currentTimerQuestion: 0,
      currentTimerGeneral: 0,
      timerQuestion: null,
      timerGeneral: null,
      step: 0,
      maxStep: null,
      questions: [],
      isLoading: true,
      errors: null
    }
  }

  async getQuestions() {
    const response = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/questions`)
    console.log(response)
    try {
      this.setState({
        questions: response.data.questions,
        maxStep: response.data.questions.length,
        timerQuestion: response.data.timers.timer_question,
        timerGeneral: response.data.timers.timer_general,
        isLoading: false
      })
    } catch(error) {
      this.setState({
        errors: error,
        isLoading: false
      })
    }
  }

  goNextStep(e) {
    e.preventDefault()
    if((this.state.step) + 1 < this.state.maxStep) {
      this.setState({
        step: this.state.step + 1
      })
    }
  }

  componentDidMount() {
    this.getQuestions()
  }

  render() {
    const { isLoading, questions, step, timerQuestion } = this.state

    return (
      <React.Fragment>
        <div className="app">
          {
            !isLoading ? (
              <React.Fragment>
                {
                  questions.map((question, index) => {
                    let item
                    if(step === index) {
                      item = <React.Fragment key={index}>
                        <TimerQuestion timer={timerQuestion} />
                        <Question data={question}/>
                      </React.Fragment>
                    }
                    return item
                  })
                }
                <button onClick={(e) => this.goNextStep(e)}>Next</button>
              </React.Fragment>
              ) : (
              <CustomLoader/>
            )
          }
        </div>
      </React.Fragment>
    );
  }
}

export default App
