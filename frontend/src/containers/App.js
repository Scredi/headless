import React, { Component } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import axios from 'axios'
import Question from '../components/Question'
import CustomLoader from '../components/Loader'
import Timer from '../components/Timer'

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      start: false,
      currentTimerQuestion: 0,
      timerQuestion: 0,
      step: 0,
      maxStep: null,
      questions: [],
      isLoading: true,
      errors: null
    }
  }

  async getQuestions() {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/questions`)
      console.log(response)
      this.setState({
        questions: response.data.questions,
        maxStep: response.data.questions.length,
        timerQuestion: response.data.timers.timer_question,
        currentTimerQuestion: response.data.timers.timer_question,
        isLoading: false
      })
    } catch(error) {
      this.setState({
        errors: error,
        isLoading: false
      })
    }
  }

  goNextStep() {
    this.stopTimer()
    if((this.state.step) + 1 < this.state.maxStep) {
      //if(prompt('Fin du temps pour cette question')) {
        this.setState({
          currentTimerQuestion: this.state.timerQuestion,
          step: this.state.step + 1
        })
      //}
    } else {
      console.log('Fini')
    }
  }

  startGame() {
    this.setState({
      start: true
    })
  }

  startTimer() {
    setInterval(() => {
      this.setState({
        currentTimerQuestion: this.state.currentTimerQuestion - 1
      })
    }, 1000)
  }

  stopTimer() {
    clearInterval(this.state.currentTimerQuestion)
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.state.start !== prevState.start) {
      this.getQuestions()
      this.startTimer()
    }
    if(prevState.currentTimerQuestion > 0 && this.state.currentTimerQuestion < 1) {
      this.goNextStep()
    }
  }

  componentWillUnmount() {
    this.stopTimer()
  }

  render() {
    const { isLoading, questions, step, timerQuestion, start, currentTimerQuestion } = this.state

    console.log(currentTimerQuestion)

    return (
      <React.Fragment>
        <div className="app">
          {
           !start ? (
               <React.Fragment>
                 <h1>Bienvenu sur le Quizz</h1>
                 <button onClick={() => this.startGame()}>Cliquez ici pour commencer</button>
               </React.Fragment>
             ) : (
               !isLoading ? (
                 <TransitionGroup transitionName="question-list">
                   {
                     questions.map((question, index) => {
                       let item
                       if(step === index) {
                         item = <CSSTransition key={index} timeout={500} className="question">
                             <React.Fragment>
                               <Timer timer={timerQuestion} />
                               <Question data={question}/>
                             </React.Fragment>
                         </CSSTransition>
                       }
                       return item
                     })
                   }
                   <button onClick={() => this.goNextStep()}>Next</button>
                 </TransitionGroup>
               ) : (
                 <CustomLoader/>
               )
             )
          }
        </div>
      </React.Fragment>
    );
  }
}

export default App
