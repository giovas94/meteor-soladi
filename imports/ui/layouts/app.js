import React from 'react';
import { Grid, Alert, Row, Col, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import AppNavigation from '../containers/app-navigation';
import { Loading } from '../components/loading.js';
import firebase from 'firebase';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      enviando: false,
    }
  }

  handleSendVerificationEmail(event) {
    event.preventDefault();
    this.setState({enviando: !this.state.enviando});

    Meteor.call( 'sendVerificationLink', ( error, response ) => {
      if ( error ) {
        Bert.alert( error.reason, 'danger' );
      } else {
        let email = Meteor.user().emails[ 0 ].address;
        this.setState({enviando: !this.state.enviando});
        Bert.alert( `Verification sent to ${ email }!`, 'success' );
      }
    });
  }

  render() {
    return <div>
      <AppNavigation />
      <Grid>
        {Meteor.loggingIn() && !this.props.currentUser ?
          <Row>
            <Col xs={12}>
              <i className="fa fa-spinner fa-pulse fa-3x"></i>
              <span className="sr-only">Loading...</span>
            </Col>
          </Row>
        : this.props.currentUser && !this.props.currentUser.emails[0].verified ?
           <Row>
            <Col xs={12}>
              <Alert bsStyle="warning">
                Necesitas verificar tu email para poder utilizar el servicio.
                <Button bsStyle="link" onClick={this.handleSendVerificationEmail.bind(this)} disabled={this.state.enviando}>Reenviar link de verificación.</Button>
                {this.state.enviando ? <p><Loading/></p> : ''}
              </Alert>
            </Col>
          </Row>
        : this.props.children}
      </Grid>
    </div>;
  }
}

App.propTypes = {
  currentUser: React.PropTypes.object,
}

App.contextTypes = {
  router: React.PropTypes.object
};

export default createContainer(() => {
  const subscription = Meteor.subscribe('user');
  const currentUser = Meteor.user();
  if (subscription.ready() && currentUser) {
    firebase.auth().signInWithCustomToken(currentUser.firebaseToken).catch(function(error) {
      console.log(error);
    });
  }
  return {
    currentUser
  };
}, App);
