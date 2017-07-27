import React from 'react';
import { Row, Col, ListGroupItem, FormControl, Button, Label } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { formatDate } from '../../modules/dates-format';

const handleSetRoles = (user, event) => {
  event.preventDefault();
  let assignedRole = event.target.value;
  Meteor.call('users.setRoles', user._id, assignedRole, (error) => {
    if (error) {
      console.log(error);
      Bert.alert(error.message, 'danger');
    } else {
      Bert.alert('Rol asignado!', 'success');
    }
  });
}

const selectRoles = (user, roles) => (
  <FormControl value={user.roles ? user.roles[0] : 'normal'} componentClass="select" onChange={handleSetRoles.bind(this, user)}>
    {roles.map((role) => (
      <option key={role._id} value={role.name}>{role.name}</option>
    ))}
  </FormControl>
)

export const User = ({ user, isAdmin, roles }) => (
  <tr>
    <td>{user.emails[0].address} {user.emails[0].verified ? <i className="fa fa-check fa-fw"></i> : <i className="fa fa-times fa-fw"></i>}</td>
    <td>{user.profile.name.first} {user.profile.name.last}</td>
    {!isAdmin ? '' : <td>{selectRoles(user, roles)}</td>}
  </tr>
);
