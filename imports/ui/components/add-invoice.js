import React from 'react';
import { Button } from 'react-bootstrap';
import { Bert } from 'meteor/themeteorchef:bert';
import { browserHistory } from 'react-router';

const handleInsertInvoice = (event) => {

  Meteor.call('newInvoice', (error, invoiceId) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert('Solicitud creada!', 'success');
      browserHistory.push(`/invoices/${ invoiceId }`);
    }
  });
};

export const AddInvoice = () => (
  <Button bsStyle="primary" onClick={ handleInsertInvoice }>
    <i className="fa fa-plus fa-lg"></i> Agregar Solicitud
  </Button>
);
