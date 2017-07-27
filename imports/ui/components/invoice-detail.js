import React from 'react';
import { Row, Col, Panel, FormGroup, FormControl, ControlLabel, Table, Button, Tooltip, OverlayTrigger, Label, ProgressBar } from 'react-bootstrap';
import DatePicker from 'react-bootstrap-date-picker';
import { Meteor } from 'meteor/meteor';
import firebase, { storageRef } from '../../startup/client/firebase-config.js';
import { _ } from 'meteor/underscore';
import { formatDate } from '../../modules/dates-format';
import { Bert } from 'meteor/themeteorchef:bert';
import { Loading } from './loading.js';
import { InvoiceItem } from './invoice-item.js';

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

export class InvoiceDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editable: false,
      loading: false,
      file: "",
      progressBar: 0,
    }

    this.throttledUpdate = _.throttle((item) => {
      if (item) {
        Meteor.call('items.update', item, (error, response) => {
          if (error) {
            Bert.alert(error.reason, 'danger');
          }
        });
      }
    }, 500);

    this.throttledUpdateDescription = _.throttle((invoiceId, description) => {
      Meteor.call('invoices.update', invoiceId, description, (error, response) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
        }
      });
    }, 500);
  }

  getItems() {
    let items = this.props.items;

    if( items.length > 0 ) {
      return items.map((item, index) => {
        return <InvoiceItem
          key={ item._id }
          id={ item._id }
          description={ item.description }
          qty={ item.qty }
          price={ item.price }
          handleRemove={ this.handleRemoveItem }
          handleUpdateField= { this.handleUpdateItemField.bind(this) }
        />
      });
    }
  }

  handleAddItem(event) {
    event.preventDefault();

    this.setState({loading: !this.state.loading});

    Meteor.call('addInvoiceItem', this.props.invoice._id, ( error ) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      }
      this.setState({loading: !this.state.loading});
    });
  }

  handleRemoveItem(itemId) {
    Meteor.call('removeInvoiceItem', itemId, ( error ) => {
      if( error ) {
        Bert.alert( error.reason, 'danger' );
      }
    });
  }

  handleUpdateItemField(itemId, updatedField, updatedValue) {
    let update = {};
    update._id = itemId;
    update[ updatedField ] = updatedValue;
    this.throttledUpdate(update);
  }

  handleUpdateInvoice(event) {
    event.preventDefault();

    let invoiceId = this.props._id;
    let description = event.target.value;

    this.throttledUpdateDescription(invoiceId, description);
  }

  _toggleEditableMode() {
    this.setState({editable: !this.state.editable});
  }

  tooltip() {
    return <Tooltip id="tooltip">Da clic para editar.</Tooltip>
  }

  handleTargetDate(targetDate) {
    // value is an ISO String.
    Meteor.call('invoices.setDate', this.props._id, targetDate, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      }
    })
  }

  onSelectFile(event) {
    event.preventDefault();

    this.setState({
      file: event.target.files
    });

    const fieldName = event.target.id;

    console.log(fieldName, event.target.files[0])

    var fileRef = storageRef.child(`files/${fieldName}/${this.props.invoice._id}`);
    var uploadTask = fileRef.put(event.target.files[0]);

    uploadTask.on('state_changed',
      function(snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.setState({progressBar: progress});
      }.bind(this),
      function(error) {
        if(error) {
          this.setState({file: ''});
          this.setState({progressBar: 0});
        }
        Bert.alert(error.reason, 'danger');
      }.bind(this),
      function() {
        Meteor.call('invoices.uploadFile', this.props.invoice._id , fieldName, uploadTask.snapshot.downloadURL, (err) => {
          if(err) {
            fileRef.delete().then(function() {
              Bert.alert(err.reason, 'danger');
            }).catch(function(error) {
              Bert.alert(error.reason, 'danger');
            });

          } else {
            Bert.alert('Archivo subido con éxito!', 'success');
          }
        });
        this.setState({file: ''});
        this.setState({progressBar: 0});
      }.bind(this)
    );
  }

  render() {
    const {loading, invoice, items, total} = this.props;
    return (
      loading ?
        <Loading />
      :
        <Row>
          <Col xs={12}>
            <Panel>
              <Row style={{paddingRight: '1.075em', textAlign: 'right'}}>
                <h3>Solicitud #{invoice.number}</h3>
                <small>{invoice._id}</small> <Label bsStyle={statusLabelStyle(invoice.status)}><strong>{invoice.status}</strong></Label>
                <h4>Total {accounting.formatMoney(total.price)} MXN</h4>
              </Row>
              <Row>
                <Col xs={12}>
                  {invoice.createdBy.displayName}
                </Col>
                <Col xs={12}>
                  {formatDate(invoice.createdAt)}
                </Col>
                <Col xs={12} style={{marginTop: '1em'}}>
                  <div>
                    <ControlLabel>Fecha límite de pago</ControlLabel>
                    <DatePicker value={!invoice.targetDate ? '' : invoice.targetDate.toISOString()} onChange={this.handleTargetDate.bind(this)} />
                  </div>
                  <div style={{marginTop: '1em'}}>
                    <ControlLabel>Descripción</ControlLabel>
                    {!this.state.editable ?
                      <div onClick={this._toggleEditableMode.bind(this)}>
                        {!invoice.description ?
                          <span><i className="fa fa-pencil"></i> Agregar descripción</span>
                        :
                          <OverlayTrigger placement='bottom' overlay={this.tooltip()}>
                            <p>{invoice.description}</p>
                          </OverlayTrigger>
                        }
                      </div>
                    :
                      <FormControl name="invoiceDescription" componentClass="textarea" defaultValue={invoice.description}
                        placeholder="Ingresa una descripción" rows="3" onChange={this.handleUpdateInvoice.bind(this)} onBlur={this._toggleEditableMode.bind(this)} autoFocus/>
                    }
                  </div>
                </Col>
              </Row>
            </Panel>
            <h4>Conceptos</h4>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th style={{textAlign: 'center'}}>Qty</th>
                  <th style={{textAlign: 'center'}}>Precio</th>
                  <th className="noprint" style={{textAlign: 'center'}}><i className="fa fa-trash-o"></i></th>
                </tr>
              </thead>
              <tbody>
                {this.getItems()}
              </tbody>
            </Table>
            <Row className="noprint">
              <Col xs={12} style={{textAlign: 'right'}}>
                <Button type="button" bsStyle="success" onClick={this.handleAddItem.bind(this)} disabled={this.state.loading}>
                  {this.state.loading ? <i className="fa fa-spinner fa-pulse fa-fw"></i>: 'Agregar fila'}
                </Button>
              </Col>
            </Row>
          </Col>
          <Col xs={12}>
            <Panel style={{marginTop: '1em'}} className="noprint">
              <h4>Archivos</h4>

              <FormGroup>
              {!this.state.file ?
                <div>
                  <ControlLabel>Factura o recibo</ControlLabel>
                  <FormControl id="invoiceFile" type="file" onChange={this.onSelectFile.bind(this)} />
                  {invoice.invoiceFileURL ?
                    <Button bsStyle="link" href={invoice.invoiceFileURL} target="_blank">
                      Descargar recibo o factura
                    </Button>

                  : ''}
                </div>
              :
                <div>
                  <ControlLabel>Subiendo archivo...</ControlLabel>
                  <ProgressBar ref="progressBar" active now={this.state.progressBar} />
                </div>
              }
              </FormGroup>


              <FormGroup>
              {!this.state.file ?
                <div>
                  <ControlLabel>Comprobante de pago</ControlLabel>
                  <FormControl id="voucherFile" type="file" onChange={this.onSelectFile.bind(this)} />
                  {invoice.voucherFileURL ? <Button bsStyle="link" href={invoice.voucherFileURL} target="_blank">Descargar comprobante</Button> : ''}
                </div>
              : '' }
              </FormGroup>
            </Panel>
          </Col>
        </Row>
    )
  }
}

InvoiceDetail.propTypes = {
  loading: React.PropTypes.bool,
  invoice: React.PropTypes.object,
  items: React.PropTypes.array,
  total: React.PropTypes.object,
};
