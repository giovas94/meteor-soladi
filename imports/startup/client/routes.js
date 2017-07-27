import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';
import App from '../../ui/layouts/app';
import { Documents } from '../../ui/pages/documents';
import { Invoices } from '../../ui/pages/invoices';
import { Invoice } from '../../ui/pages/invoice';
import { Users } from '../../ui/pages/users';
import { Index } from '../../ui/pages/index';
import { Login } from '../../ui/pages/login';
import { NotFound } from '../../ui/pages/not-found';
import { RecoverPassword } from '../../ui/pages/recover-password';
import { ResetPassword } from '../../ui/pages/reset-password';
import { VerifyEmail } from '../../ui/pages/verify-email';
import { Signup } from '../../ui/pages/signup';

const requireAuth = (nextState, replace) => {
  if (!Meteor.loggingIn() && !Meteor.userId()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname },
    });
  }
};

var redirectIfLoggedIn = (nextState, replace, next) => {
  if (Meteor.userId()) {
    replace('/');
  }

  next();
};

Meteor.startup(() => {
  render(
    <Router history={ browserHistory }>
      <Route name="verify-email" path="/verify-email/:token" component={ VerifyEmail } />
      <Route path="/" component={ App }>
        <IndexRoute name="index" component={ Index } onEnter={ requireAuth } />
        <Route name="documents" path="/documents" component={ Documents } onEnter={ requireAuth } />
        <Route name="invoices" path="/invoices" component={ Invoices } onEnter={ requireAuth } />
        <Route name="invoice" path="/invoices/:_id" component={ Invoice } onEnter={ requireAuth } />
        <Route name="users" path="/users" component={ Users } onEnter={ requireAuth } />
        <Route name="login" path="/login" component={ Login } onEnter={ redirectIfLoggedIn } />
        <Route name="recover-password" path="/recover-password" component={ RecoverPassword } />
        <Route name="reset-password" path="/reset-password/:token" component={ ResetPassword } />
        <Route name="signup" path="/signup" component={ Signup } />
        <Route path="*" component={ NotFound } />
      </Route>
    </Router>,
    document.getElementById('react-root')
  );
});
