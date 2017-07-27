import faker from 'faker';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Factory } from 'meteor/dburles:factory';

export const InvoiceItems = new Mongo.Collection('invoiceItems');

InvoiceItems.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

InvoiceItems.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});
