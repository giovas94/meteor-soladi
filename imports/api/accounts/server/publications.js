import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

Meteor.publish('allUsers', function(search) {
  check(search, Match.OneOf(String, null, undefined));

  const currentUser = this.userId;
  const isAdmin = Roles.userIsInRole(currentUser, 'admin');
  let filterQuery = {};

  const publicFields = {"emails": 1, "username": 1, "roles": 1, "profile.name": 1};

  if(!currentUser) {
    return this.ready();
  }

  if(!isAdmin) {
    return this.ready();
  }

  if (search) {
    let regex = new RegExp(search, 'i');

    filterQuery = {
      $or: [
        {'emails.address': regex},
        {'profile.name.first': regex},
        {'profile.name.last': regex},
      ]
    };

    return Meteor.users.find(filterQuery, { fields: publicFields });
  }

  return Meteor.users.find({}, { fields: publicFields });
});

Meteor.publish('user', function() {
  if(!this.userId) {
    return this.ready();
  }

  return Meteor.users.find({_id: this.userId}, { fields: { firebaseToken: 1 } });
})

Meteor.publish(null, function (){
  if(!this.userId) {
      return this.ready();
  }

  return Meteor.roles.find({})
});
