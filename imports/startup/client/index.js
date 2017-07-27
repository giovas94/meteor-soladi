import { Bert } from 'meteor/themeteorchef:bert';
import 'bootstrap/dist/css/bootstrap.min.css';
import './routes.js';
import './firebase-config.js';
import './accounts/config.js';

Bert.defaults.style = 'growl-top-right';
Bert.defaults.hideDelay = 5000;
