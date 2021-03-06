import React from 'react'
import Snackbar from 'material-ui/Snackbar'
import {connect} from 'react-redux'
import {closeSnackbar} from 'redux/actions/snackbarActions'

class ReduxSnackbar extends React.Component {
  render() {
    const {snackbar} = this.props
    return(
      <Snackbar open={snackbar.open} message={snackbar.message} autoHideDuration={snackbar.duration} onRequestClose={this.props.closeSnackbar} />
    )
  }
}

function mapStateToProps(state) {
  return {
    snackbar: state.ui.snackbar
  }
}

export default ReduxSnackbar = connect(mapStateToProps, {closeSnackbar})(ReduxSnackbar)
