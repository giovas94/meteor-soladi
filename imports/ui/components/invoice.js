import React from 'react';
import { Row, Col, ListGroupItem, FormControl, Button, Label } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Bert } from 'meteor/themeteorchef:bert';
import { formatDate } from '../../modules/dates-format';

const statusLabelStyle = (status) => {
  switch (status) {
    case 'rechazado':
      return 'danger';
    case 'aprobado':
      return 'success';
    case 'cancelado':
      return 'warning';
    case 'entregado':
      return 'primary';
    case 'cerrado':
      return 'info';
    default:
      return 'default';
  }
}

const handleUpdateStatus = (invoiceId, event) => {
  event.preventDefault();
  Meteor.call('invoices.updateStatus', invoiceId, event.target.value, ( error ) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert('Solicitud actualizada!', 'success');
    }
  });
}

const handleCancelInvoice = (invoiceId, event) => {
  event.preventDefault();
  if (confirm('Estas seguro de cancelar la solicitud? Esto es permanente.')) {
    Meteor.call('invoices.cancel', invoiceId, ( error ) => {
      if(error) {
        console.log(error);
        Bert.alert(error.error, 'danger');
      } else {
        Bert.alert('Solicitud cancelada!', 'success');
      }
    });
  }
}

export const Invoice = ({ invoice, isAdmin }) => (
  <ListGroupItem key={ invoice._id } >
    <Row>
      <Col xs={ 4 } sm={ 2 } style={{paddingTop: '.5em'}} >
        Solicitud #{invoice.number}
      </Col>
      <Col xsHidden={true} sm={ 6 } style={{fontSize: '12px'}} >
        Descripción <strong>{invoice.description}</strong>
        <br/>
        Creado el <strong>{formatDate(invoice.createdAt)}</strong> por <strong>{invoice.createdBy.displayName}</strong>
        <br/>
        Última actualización <strong>{invoice.updatedAt ? formatDate(invoice.updatedAt) : 'nunca'}</strong>
      </Col>
      <Col xs={ 4 } sm={ 2 } >
        <LinkContainer to={ `/invoices/${invoice._id}` }>
          <Button
            bsStyle="primary"
            className="btn-block">
            Detalle
          </Button>
        </LinkContainer>
      </Col>
      <Col xs={4}  sm={2} style={{textAlign: 'center'}}>
        {!isAdmin ?
          <div>
            <Label bsStyle={statusLabelStyle(invoice.status)}><strong>{invoice.status}</strong></Label>
            {invoice.status !== 'pendiente' ?
              ''
            :
              <Button bsStyle="link" style={{fontSize: 10}} value="cancelar"
                onClick={handleCancelInvoice.bind(this, invoice._id)}>Cancelar</Button>
            }
          </div>
        :
          <FormControl value={invoice.status}
          componentClass="select" onChange={handleUpdateStatus.bind(this, invoice._id)}>
            <option value="aprobado">Aprobado</option>
            <option value="cancelado">Cancelado</option>
            <option value="cerrado">Cerrado</option>
            <option value="entregado">Entregado</option>
            <option value="pendiente">Pendiente</option>
            <option value="rechazado">Rechazado</option>
          </FormControl>
        }
      </Col>
    </Row>
  </ListGroupItem>
);
