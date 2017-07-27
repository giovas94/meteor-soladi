import { Invoices } from './invoices';
import { InvoiceItems } from '../invoiceItems/invoiceItems';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { _ } from 'meteor/underscore';

Meteor.methods({
  newInvoice() {

    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    let owner = Meteor.users.findOne(this.userId);
    let {first, last} = owner.profile.name;
    let count = Invoices.find().count();
    let invoiceId = Invoices.insert({
          number: count + 1,
          createdBy: {
            id: Meteor.userId(),
            displayName: owner && (first || last) ? `${first} ${last}` : null,
          },
          createdAt: new Date(),
          status: 'pendiente',
        });

    InvoiceItems.insert({
      invoice: invoiceId,
      description: '',
      qty: null,
      price: null,
    });

    return invoiceId;
  },
  'invoices.update'(invoiceId, description) {
    check(invoiceId, String);
    check(description, String);

    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    try {
      Invoices.update(invoiceId, {
        $set: {description, updatedAt: new Date()}
      });
    } catch (exception) {
      throw new Meteor.Error('500', `${ exception }`);
    }
  },
  'invoices.updateStatus'(invoiceId, status) {
    check(invoiceId, String);
    check(status, String);

    const validStatus = ['pendiente', 'rechazado', 'aprobado', 'cancelado', 'cerrado', 'entregado'];
    const isAdmin = Roles.userIsInRole(this.userId, 'admin');

    if (! this.userId || ! isAdmin) {
      throw new Meteor.Error('not-authorized');
    }

    if (! _.contains(validStatus, status)) {
      throw new Meteor.Error('status value not allowed');
    }

    try {
      Invoices.update(invoiceId, {
        $set: {status, updatedAt: new Date()}
      })
    } catch (exception) {
      throw new Meteor.Error('500', `${ exception }`);
    }
  },
  'invoices.setDate'(invoiceId, targetDate) {
    check(invoiceId, String);
    check(targetDate, String);

    const formattedDate = new Date(targetDate);

    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    try {
      Invoices.update(invoiceId, {
        $set: {targetDate: formattedDate, updatedAt: new Date()}
      });
    } catch (exception) {
      throw new Meteor.Error('500', `${ exception }`);
    }
  },
  'invoices.cancel'(invoiceId) {
    check(invoiceId, String);

    const invoiceOwner = Invoices.findOne(invoiceId).createdBy.id;
    
    if (! this.userId || invoiceOwner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Invoices.update(invoiceId, {
      $set: {status: 'cancelado', updatedAt: new Date()}
    })
  },
  'invoices.uploadFile'(invoiceId, fileField, fileURL) {
    check(invoiceId, String);
    check(fileField, String);
    check(fileURL, String);

    const file = {};

    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    file[`${fileField}URL`] = fileURL;

    Invoices.update(invoiceId, { $set: file });
  }
});
