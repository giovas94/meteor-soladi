import { UsersList } from '../components/users-list.js';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { createContainer } from 'meteor/react-meteor-data';
import { ReactiveVar } from 'meteor/reactive-var';

let searchUserQuery = new ReactiveVar("");

export default createContainer(({ params }) => {
  const subscription = Meteor.subscribe('allUsers', searchUserQuery.get());
  const loading = !subscription.ready();
  const users = Meteor.users.find().fetch();
  const roles = Roles.getAllRoles().fetch();
  const currentUser = Meteor.userId();
  const isAdmin = Roles.userIsInRole(currentUser, 'admin');

  return {
    loading,
    searchUserQuery,
    users,
    roles,
    currentUser,
    isAdmin,
  };
}, UsersList);
