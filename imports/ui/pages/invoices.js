import React from 'react';
import { Row, Col } from 'react-bootstrap';
import InvoicesList from '../containers/invoices-list.js';
import { AddInvoice } from '../components/add-invoice.js';

export const Invoices = () => (
    <Row>
      <Col xs={ 12 }>
        <h4 className="page-header">Solicitudes</h4>
        <AddInvoice />
        <br/>
        <InvoicesList />
      </Col>
    </Row>

);
