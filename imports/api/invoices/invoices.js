import faker from 'faker';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Factory } from 'meteor/dburles:factory';

export const Invoices = new Mongo.Collection('Invoices');

Invoices.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Invoices.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});
