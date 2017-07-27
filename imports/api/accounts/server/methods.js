import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Roles } from 'meteor/alanning:roles';
import { Accounts } from 'meteor/accounts-base';

Meteor.methods({
  'users.setRoles'(user, assignedRole) {
    check(user, String);
    check(assignedRole, String);

    const availableRoles = Roles.getAllRoles().fetch();

    const userId = this.userId;
    const isAdmin = Roles.userIsInRole(this.userId, 'admin');

    const adminsQty = Roles.getUsersInRole('admin').count();

    if (! userId || ! isAdmin) {
      throw new Meteor.Error('not-authorized');
    }

    if (! _.contains(_.pluck(availableRoles, 'name'), assignedRole)) {
      throw new Meteor.Error('status value not allowed');
    }

    if (adminsQty === 1 && user === userId) {
      throw new Meteor.Error('Debe haber al menos un administrador');
    }

    Roles.setUserRoles(user, assignedRole);
  },
  'users.firebaseToken'(userId, token) {
    check(userId, String);
    check(token, String);

    Meteor.users.update({"_id": userId}, { $set: { firebaseToken: token }});
  }
});
