import React from 'react';
import { Grid, Row, Col, Alert, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
import { browserHistory } from 'react-router';
import { Accounts } from 'meteor/accounts-base';
import { Bert } from 'meteor/themeteorchef:bert';

export class VerifyEmail extends React.Component {
  componentDidMount() {
    Accounts.verifyEmail(this.props.params.token, (error) => {
      if ( error ) {
        Bert.alert( error.reason, 'danger' );
      } else {
        Bert.alert( 'Email verified! Thanks!', 'success' );
      }
      browserHistory.push( '/' );
    });
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col xs={ 12 }>
            <h4 className="page-header">Verificando Email</h4>
            <Alert bsStyle="info">
              Estamos verificando tu cuenta de correo electrónico. Serás redireccionado.
            </Alert>
          </Col>
        </Row>
      </Grid>
    );
  }
}

VerifyEmail.propTypes = {
  params: React.PropTypes.object,
};
