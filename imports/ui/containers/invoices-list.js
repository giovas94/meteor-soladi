import { Invoices } from '../../api/invoices/invoices.js';
import { InvoicesList } from '../components/invoices-list.js';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { createContainer } from 'meteor/react-meteor-data';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/stevezhu:lodash';

let searchInvoiceQuery = new ReactiveVar("");
let toggleCanceled = new ReactiveVar(true);
let toggleClosed = new ReactiveVar(false);

let pagination = new Meteor.Pagination(Invoices);

export default createContainer(({ params }) => {

  pagination.perPage(5);
  pagination.sort({createdAt: -1});

  let query = {};
  let hideArr = [];
  const hideQuery = { status: { $nin: hideArr } };
  let regex = new RegExp(searchInvoiceQuery.get(), 'i');
  const filterQuery = {
    $or: [
      {number: {$regex: searchInvoiceQuery.get(), $options: 'i'}},
      {'createdBy.displayName': {$regex: searchInvoiceQuery.get(), $options: 'i'}},
      {description: {$regex: searchInvoiceQuery.get(), $options: 'i'}},
      {status: {$regex: searchInvoiceQuery.get(), $options: 'i'}},
    ]
  };

  const loading = !pagination.ready();
  const invoices = pagination.getPage();
  // const subscription = Meteor.subscribe('invoices', searchInvoiceQuery.get(), toggleCanceled.get(), toggleClosed.get());
  // const loading = !subscription.ready();
  // const invoices = Invoices.find({}, { sort: {createdAt: -1} }).fetch();
  const currentUser = Meteor.userId();
  const isAdmin = Roles.userIsInRole(currentUser, 'admin');

  if (toggleCanceled.get()) {
    hideArr.push('cancelado');
  }

  if (toggleClosed.get()) {
    hideArr.push('cerrado');
  }

  query = _.assign(query, hideQuery);

  if (searchInvoiceQuery.get()) {
    query = _.assign(query, filterQuery);
  }

  pagination.filters(query);

  return {
    pagination,
    loading,
    searchInvoiceQuery,
    toggleCanceled,
    toggleClosed,
    invoices,
    currentUser,
    isAdmin,
  };
}, InvoicesList);
