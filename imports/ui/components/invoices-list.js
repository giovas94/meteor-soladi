import React from 'react';
import { Row, Col, ListGroup, ListGroupItem, Alert, FormGroup, FormControl, Checkbox } from 'react-bootstrap';
import { Invoice } from './invoice.js';
import { Loading } from './loading.js';
import BootstrapPaginator from 'react-bootstrap-pagination';


const renderInvoicesList = (pagination, invoices, isAdmin) => {
  return invoices.length > 0 ?
    <div>
      <ListGroup className="invoices-list" style={{marginTop:'1em'}}>
        {invoices.map((invoice) => (
          <Invoice key={ invoice._id } invoice={ invoice } isAdmin={isAdmin} />
        ))}
      </ListGroup>
      <BootstrapPaginator pagination={pagination} limit={pagination.perPage()} containerClass='text-center' />
    </div>
  :
    <Alert bsStyle="warning" style={{marginTop: '1em'}}>No hay solicitudes.</Alert>
}

export const InvoicesList = ({pagination, loading, searchInvoiceQuery, toggleCanceled, toggleClosed, invoices, isAdmin}) => {
  const _handleSerch = (event) => {
    searchInvoiceQuery.set(event.target.value);
  }

  return (
    <div>
      <Row>
        <Col xs={8} md={10}>
          <FormControl
            style={{marginTop: '1em'}}
            type="search"
            placeholder="Buscar"
            value={searchInvoiceQuery.get()}
            onChange={_handleSerch}
            autoFocus
          />
        </Col>
        <Col xs={4} md={2}>
          <FormGroup
            style={{marginTop: '1em'}}
          >
            <Checkbox checked={toggleCanceled.get()} onChange={() => {toggleCanceled.set(!toggleCanceled.get())}}>Ocultar cancelados</Checkbox>
            <Checkbox checked={toggleClosed.get()} onChange={() => {toggleClosed.set(!toggleClosed.get())}}>Ocultar cerrados</Checkbox>
          </FormGroup>
        </Col>
      </Row>
      {loading ? <Loading /> : renderInvoicesList(pagination, invoices, isAdmin)}
    </div>
  )
}

InvoicesList.propTypes = {
  loading: React.PropTypes.bool,
  invoices: React.PropTypes.array,
  currentUser: React.PropTypes.string,
  isAdmin: React.PropTypes.bool,
};
