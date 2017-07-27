import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Roles } from 'meteor/alanning:roles';
import { Accounts } from 'meteor/accounts-base';

Meteor.methods({
  sendVerificationLink() {
    let userId = this.userId;
    if ( userId ) {
      return Accounts.sendVerificationEmail( userId );
    }
  }
});
