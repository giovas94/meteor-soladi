import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Invoices } from '../invoices';
import { InvoiceItems } from '../../invoiceItems/invoiceItems';
import { _ } from 'meteor/stevezhu:lodash';


new Meteor.Pagination(Invoices, {
  dynamic_filters: function() {
    let query = {};
    const currentUser = this.userId;
    const isAdmin = Roles.userIsInRole(currentUser, 'admin');
    const OwnQuery = { "createdBy.id": currentUser };

    if (!isAdmin) {
      query = _.assign(query, OwnQuery);
    }

    return query;
  }
});

// Meteor.publish('invoices', function invoicesPublication(search, hideCanceled, hideClosed) {
//   check(search, Match.OneOf(String, null, undefined));
//   check(hideCanceled, Match.OneOf(Boolean, undefined));
//   check(hideClosed, Match.OneOf(Boolean, undefined));
//
//   let hideArr = [];
//   const currentUser = this.userId;
//   const isAdmin = Roles.userIsInRole(currentUser, 'admin');
//   const hideQuery = { status: { $nin: hideArr } };
//   const OwnQuery = { "createdBy.id": currentUser };
//   let regex = new RegExp(search, 'i');
//   const filterQuery = {
//     $or: [
//       {number: regex},
//       {'createdBy.displayName': regex},
//       {description: regex},
//       {status: regex},
//     ]
//   };
//
//   let query = {};
//
//   if(!currentUser) {
//     return this.ready();
//   }
//
//   if (hideCanceled) {
//     hideArr.push('cancelado');
//   }
//
//   if (hideClosed) {
//     hideArr.push('cerrado');
//   }
//
//   query = _.assign(query, hideQuery);
//
//   if(search){
//     query = _.assign(query, filterQuery);
//   }
//
//   if (!isAdmin) {
//     query = _.assign(query, OwnQuery);
//   }
//
//   return Invoices.find(query);
// });



Meteor.publish('invoice', (invoiceId) => {
  check(invoiceId, String);

  return [
    Invoices.find({ _id: invoiceId }),
    InvoiceItems.find({ invoice: invoiceId }),
  ];
});
