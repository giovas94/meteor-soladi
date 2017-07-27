import { Accounts } from 'meteor/accounts-base';
import firebase from 'firebase';


Accounts.config({
  sendVerificationEmail: true,
  restrictCreationByEmailDomain: function (email) {
    const validDomanins = ['soladi.onmicrosoft.com', 'soladi.net', 'soladi.com.mx'];
    const emailDomain = email.replace(/.*@/, "");

    return _.contains(validDomanins, emailDomain);
  },
  // loginExpirationInDays: 90,
});

Accounts.onLogin((callback) => {
  const currentUser = callback.user._id
  var token = firebase.auth().createCustomToken(currentUser);

  Meteor.call('users.firebaseToken', currentUser, token, (err) => {
    if (err) {
      console.log(err);
      Meteor.logout();
    }
  });
});
