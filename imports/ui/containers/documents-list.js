import { Documents } from '../../api/documents/documents.js';
import { DocumentsList } from '../components/documents-list.js';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

export default createContainer(({ params }) => {
  const subscription = Meteor.subscribe('documents');
  const loading = !subscription.ready();
  const documents = Documents.find().fetch();

  return {
    loading,
    documents,
  };
}, DocumentsList);
