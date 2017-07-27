import { Accounts } from 'meteor/accounts-base';
import firebase from 'firebase';
import { Bert } from 'meteor/themeteorchef:bert';

Accounts.onLogout(() => {
  firebase.auth().signOut().then(function() {
    Bert.alert('Bye!', 'success');
  })
});
