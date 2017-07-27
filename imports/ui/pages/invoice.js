import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router';

import InvoiceDetail from '../containers/invoice-detail.js';

export const Invoice = ({params: {_id}}) => (
  <Row>
    <Col xs={ 12 }>
      <h4 className="page-header">
        <Link className="noprint" to="/invoices">
          <i className="fa fa-chevron-left" aria-hidden="true"></i>
        </Link> Detalle de solicitud
        <i  className="noprint fa fa-print fa-lg"
            style={{float: 'right', verticalAlign: 'middle', cursor: 'pointer'}}
            onClick={() => window.print()}></i>
      </h4>
      <InvoiceDetail _id={_id} />
    </Col>
  </Row>
);
