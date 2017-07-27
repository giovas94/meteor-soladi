import { Invoices } from '../../api/invoices/invoices.js';
import { InvoiceItems } from '../../api/invoiceItems/invoiceItems.js';
import { InvoiceDetail } from '../components/invoice-detail.js';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { accounting } from 'meteor/iain:accounting';
import { createContainer } from 'meteor/react-meteor-data';

export default createContainer(({_id}) => {
  const subscription = Meteor.subscribe('invoice', _id);
  const loading = !subscription.ready();
  const invoice = Invoices.findOne();
  const items = InvoiceItems.find().fetch();
  const total = _.reduce(items, function(memo, num){
    return { price: accounting.unformat(memo.price) + accounting.unformat(num.price) }
  }, { price: 0 });

  return {
    loading,
    invoice,
    items,
    total,
  };
}, InvoiceDetail);
