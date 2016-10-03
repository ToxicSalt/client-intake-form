import React, {PropTypes} from 'react'
import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import FlatButton from 'material-ui/FlatButton'
import {logout} from 'redux/actions/authActions'
import {connect} from 'react-redux'
import withRouter from 'react-router/lib/withRouter'

class Header extends React.Component {
  constructor() {
    super()
    this.state = {
      open: false
    }
  }
  
  handleToggle = () => this.setState({
    open: !this.state.open
  })

  handleClose = () => this.setState({
    open: false
  })
  
  renderIconElementRight = () => {
    const {authenticated, router, handleLogoutClick} = this.props
    if (authenticated) {
      return <FlatButton label="Logout" onClick={handleLogoutClick}/>
    }
    return <FlatButton label="Login" onClick={() => router.push('/login')}/> 
  }

  render() {
    return (
    <div>
      <AppBar title="Questionnaire" onLeftIconButtonTouchTap={this.handleToggle} iconElementRight={this.renderIconElementRight()} zDepth={0}/>
      <Drawer docked={false} width={200} open={this.state.open} onRequestChange={(open) => this.setState({open})}>
        <MenuItem onTouchTap={this.handleClose}>Menu Item</MenuItem>
        <MenuItem onTouchTap={this.handleClose}>Menu Item 2</MenuItem>
      </Drawer>
    </div>
    )
  }
}
Header.contextTypes = {
}

function mapStateToProps(state) {
  return {authenticated: state.auth.authenticated}
}

export default withRouter(connect(mapStateToProps, {handleLogoutClick: logout})(Header))
