import firebase from 'firebase';

// Initialize Firebase
var config = {
  "type": Meteor.settings.private.firebase.type,
  "project_id": Meteor.settings.private.firebase.project_id,
  "private_key_id": Meteor.settings.private.firebase.private_key_id,
  "private_key": Meteor.settings.private.firebase.private_key,
  "client_email": Meteor.settings.private.firebase.client_email,
  "client_id": Meteor.settings.private.firebase.client_id,
  "auth_uri": Meteor.settings.private.firebase.auth_uri,
  "token_uri": Meteor.settings.private.firebase.token_uri,
  "auth_provider_x509_cert_url": Meteor.settings.private.firebase.auth_provider_x509_cert_url,
  "client_x509_cert_url": Meteor.settings.private.firebase.client_x509_cert_url
};

firebase.initializeApp({
  serviceAccount: config,
  databaseURL: 'https://pvert-app.firebaseio.com',
});
