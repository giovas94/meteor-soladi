import React from 'react';
import ReactDOM from 'react-dom';
import { FormControl, Tooltip, OverlayTrigger } from 'react-bootstrap';

export class InvoiceItem extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    $(`#price-${this.props.id}`).inputmask("numeric", {
      radixPoint: ".",
      groupSeparator: ",",
      digits: 2,
      autoGroup: true,
      prefix: "$ ",
      rightAlign: true,
      // onKeyDown: this.handleUpdateField.bind(this)
    });
    $(`#price-${this.props.id}`).on('keyup', this.handleUpdateField.bind(this));
  }

  handleRemove() {
    this.props.handleRemove(this.props.id);
  }

  handleUpdateField(event) {
    let {name, value} = event.target;
    this.props.handleUpdateField(this.props.id, name, value);
  }

  render() {
    let {id, description, qty, price} = this.props;
    return (
      <tr>
        <td>
          <FormControl name="description" type="text" defaultValue={description} onChange={this.handleUpdateField.bind(this)} />
        </td>
        <td style={{textAlign: 'center'}}>
          <FormControl name="qty" type="number" defaultValue={qty} onChange={this.handleUpdateField.bind(this)} />
        </td>
        <td style={{textAlign: 'center'}}>
          <FormControl id={"price-"+id} name="price" defaultValue={price} />
        </td>
        <td className="noprint" style={{textAlign: 'center', verticalAlign: 'middle'}}
          onClick={this.handleRemove.bind(this)}>
          <i className="fa fa-remove" style={{color: 'red', cursor:'pointer'}}></i>
        </td>
      </tr>
    )
  }
}
