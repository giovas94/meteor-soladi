import { Meteor } from 'meteor/meteor';
import { InvoiceItems } from '../invoiceItems';

Meteor.publish('invoiceItems', () => InvoiceItems.find());
