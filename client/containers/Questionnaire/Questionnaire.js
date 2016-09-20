import React, {PropTypes} from 'react'
import PersonalForm from './PersonalForm'
import EmployerForm from './EmployerForm'
import InsuranceForm from './InsuranceForm'
import AccidentForm from './AccidentForm'
import 'whatwg-fetch'
import {SubmissionError, reduxForm} from 'redux-form'
import {
    Tabs,
    Tab,
    TextField,
    DatePicker,
    RaisedButton,
    FlatButton,
    Stepper,
    Step,
    StepLabel,
    StepButton,
    StepContent,
    Paper,
} from 'material-ui'
import SubmitDialog from 'components/SubmitDialog'
import {Grid, Row, Col} from 'react-flexbox-grid'
import {connect} from 'react-redux'

let styles = {
  paper: {
    padding: 10,
    paddingBottom: 30,
    maxWidth: '1200px',
    margin: '15px auto'
  }
}
function onSubmit(data) {
  let body = new FormData()
  Object.keys(data).forEach(( key ) => {
    if (key === 'accidentPhotos') {
      data[key].map(file => {
        body.append(key, file, file.name)
      })
    } else {
      body.append(key, data[key])
    }
  })
  return new Promise((resolve, reject) => {
    fetch('/clients', {
      method: 'post',
      body
    })
      .then(response => {
        if (response.status === 200) {
          resolve('It works')
        }
        else if (response.status === 400) {
          response.json()
          .then(errors => {
            errors._error = 'Please correct all marked fields and try again.'
            reject(new SubmissionError(errors))
          })        }
        else if (response.status === 500) {
          reject(new SubmissionError({_error: 'The server is experiencing technical difficulties. Your submission was not stored.'}))
        }
        else {
          reject(new SubmissionError({_error: 'An unknown error occurred.'}))
        }
      })
  })
}
class Questionnaire extends React.Component {
  constructor() {
    super()
    this.state = {
      stepIndex: 0
    }
  }
  nextStep = () => {
    this.setState({
      stepIndex: this.state.stepIndex + 1
    })
  }
  previousStep = () => {
    this.setState({
      stepIndex: this.state.stepIndex - 1
    })
  }
  renderStepActions(step) {
    const {stepIndex} = this.state
    return (
            <div style={{
              margin: '12px 0'
            }}>
                <RaisedButton label={stepIndex === 3
                    ? 'Finish'
                    : 'Next'} disableTouchRipple={true} type='submit' onSubmit={stepIndex === 3
                    ? onSubmit
                    : this.nextStep} disableFocusRipple={true} primary={true} style={{
                      marginRight: 12
                    }}/> {step > 0 && (<FlatButton label="Back" disabled={stepIndex === 0} disableTouchRipple={true} disableFocusRipple={true} onTouchTap={this.previousStep}/>)}
            </div>
        )
  }
  getStepContent(step) {
    const {stepIndex} = this.state

    switch (step) {
    case 0:
      return <PersonalForm onSubmit={this.nextStep} stepper={this.renderStepActions(step)}/>
    case 1:
      return <EmployerForm onSubmit={this.nextStep} stepper={this.renderStepActions(step)}/>
    case 2:
      return <InsuranceForm onSubmit={this.nextStep} stepper={this.renderStepActions(step)}/>
    case 3:
      return <AccidentForm onSubmit={onSubmit} stepper={this.renderStepActions(step)}/>
    default:

    }
  }
  render() {
    const {stepIndex} = this.state
    return (
            <Paper zDepth={1} style={styles.paper}>
              <Stepper linear={false} activeStep={stepIndex} orientation='vertical'>
                  <Step>
                      <StepButton onClick={() => this.setState({stepIndex: 0})}>
                          Personal information
                      </StepButton>
                      <StepContent>
                          {this.getStepContent(stepIndex)}
                      </StepContent>
                  </Step>
                  <Step>
                      <StepButton onClick={() => this.setState({stepIndex: 1})}>
                          Employer information
                      </StepButton>
                      <StepContent>
                          {this.getStepContent(stepIndex)}
                      </StepContent>
                  </Step>
                  <Step>
                      <StepButton onClick={() => this.setState({stepIndex: 2})}>
                          Insurance information
                      </StepButton>
                      <StepContent>
                          {this.getStepContent(stepIndex)}
                      </StepContent>
                  </Step>
                  <Step>
                      <StepButton onClick={() => this.setState({stepIndex: 3})}>
                          Accident information
                      </StepButton>
                      <StepContent>
                          {this.getStepContent(stepIndex)}
                      </StepContent>
                  </Step>
              </Stepper>
              <SubmitDialog dialog={this.props.dialog}/>
            </Paper>
        )
  }
}
Questionnaire.contextTypes = {
  muiTheme: PropTypes.object.isRequired
}
const mapStateToProps = (state) => {
  return {
    dialog: state.dialog
  }
}
// Questionnaire = reduxForm({
//   form: 'questionnaire',
//   onSubmit,
//   onSubmitSuccess,
//   onSubmitFail
// })(Questionnaire)
export default Questionnaire = connect(mapStateToProps)(Questionnaire)
