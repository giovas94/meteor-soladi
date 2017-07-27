import { InvoiceItems } from './invoiceItems';
import { Invoices } from '../invoices/invoices';
import { Meteor } from 'meteor/meteor';

Meteor.methods({
  addInvoiceItem(invoiceId) {
    check(invoiceId, String);

    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Invoices.update(invoiceId, {
      $set: {updatedAt: new Date()}
    });

    return InvoiceItems.insert({
      invoice: invoiceId,
      description: '',
      qty: null,
      price: null
    });
  },
  removeInvoiceItem(itemId) {
    check( itemId, String );

    return InvoiceItems.remove( itemId );
  },
  'items.update'(item) {
    check(item, {
      _id: String,
      description: Match.Optional( String ),
      qty: Match.Optional( String ),
      price: Match.Optional( String ),
    });

    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const invoiceId = InvoiceItems.findOne(item._id).invoice;

    try {
      Invoices.update(invoiceId, {
        $set: {updatedAt: new Date()}
      });

      InvoiceItems.update( item._id, {
        $set: item
      });
    } catch ( exception ) {
      throw new Meteor.Error('500', `${ exception }`);
    }
  }
});
