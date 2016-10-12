import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {loadForm, submitForm} from 'redux/actions/formActions'
import PersonalForm from './PersonalForm'
import EmployerForm from './EmployerForm'
import InsuranceForm from './InsuranceForm'
import AccidentForm from './AccidentForm'
import 'whatwg-fetch'
import {SubmissionError, reduxForm} from 'redux-form'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import {Stepper, Step, StepButton, StepContent} from 'material-ui/Stepper'
import Paper from 'material-ui/Paper'
import {Grid, Row, Col} from 'react-flexbox-grid'
import {openSnackbar} from 'redux/actions/snackbarActions'

let styles = {
  paper: {
    padding: 10,
    paddingBottom: 30,
    maxWidth: '1200px',
    margin: '15px auto'
  }
}

class Questionnaire extends React.Component {
  constructor() {
    super()
    this.state = {
      stepIndex: 0
    }
  }
  handleSubmit = (data) => {
    const {submitForm, user, admin} = this.props

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
    if (user.role === 'admin') {
      return submitForm('questionnaire', admin.selectedClient, body)
    }
    else {
      return submitForm('questionnaire', user.id, body)
    }
  }
  componentWillMount = () => {
    const {openSnackbar, loadForm, user, admin} = this.props
    if (user.role !== 'admin') {
      loadForm('questionnaire', user.id) 
    }

    if (user.role === 'admin' && admin.selectedClient === '') {
      openSnackbar('Select a client to begin')
    }
  }
  showDatePickerTip = () => {
    this.props.openSnackbar('Click the year in the corner to select the year')
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
    const {admin, user} = this.props
    return (
            <div style={{margin: '12px 0'}}>
              <RaisedButton 
                label={stepIndex === 3 ? 'Finish':'Next'}
                disableTouchRipple={true} 
                type='submit' 
                onSubmit={stepIndex === 3 ? this.onSubmit : this.nextStep}
                disableFocusRipple={true}
                primary={true} 
                style={{marginRight: 12}}
                disabled={user.role === 'admin' && admin.selectedClient === ''}
              />
              {step > 0 && (<FlatButton label="Back" disabled={stepIndex === 0} disableTouchRipple={true} disableFocusRipple={true} onTouchTap={this.previousStep}/>)}
            </div>
        )
  }
  getStepContent(step) {
    let formProps = {showDatePickerTip: this.showDatePickerTip, userData: this.props.formData, enableReinitialize: true, stepper: this.renderStepActions(step)}
    //if (this.props.role === 'admin') {
      //formProps.enableReinitialize = true
      //formProps.keepDirtyOnReinitialize = true
    //}

    switch (step) {
    case 0:
      return <PersonalForm onSubmit={this.nextStep} {...formProps} />
    case 1:
      return <EmployerForm onSubmit={this.nextStep} {...formProps} />
    case 2:
      return <InsuranceForm onSubmit={this.nextStep} {...formProps} />
    case 3:
      return <AccidentForm onSubmit={this.handleSubmit} {...formProps}/>
    default:

    }
  }
  render() {
    const {stepIndex} = this.state
    const {user, admin, openSnackbar} = this.props
    if (user.role === 'admin' && admin.selectedClient === '') {
      return <div></div>
    }
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
            </Paper>
        )
  }
}
Questionnaire.contextTypes = {
  muiTheme: PropTypes.object.isRequired
}
function mapStateToProps(state) {
  return {
    formData: state.formData,
    user: state.auth.user,
    admin: state.admin
  }
}
export default connect(mapStateToProps, {loadForm, submitForm, openSnackbar})(Questionnaire)
