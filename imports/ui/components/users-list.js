import React from 'react';
import { ListGroup, ListGroupItem, Alert, FormControl, Table, Panel } from 'react-bootstrap';
import { Loading } from './loading.js';
import { User } from './user.js';

const getUsers = (users, roles, isAdmin) => {

  if( users.length > 0 ) {
    return users.map((user, index) => {
      return (
        <User key={user._id} user={user} isAdmin={isAdmin} roles={roles}/>
      )
    });
  }
}

export const UsersList = ({loading, searchUserQuery, users, roles, isAdmin}) => {

  const _handleSerch = (event) => {
    searchUserQuery.set(event.target.value);
  }

  return (
    <div>
      {!isAdmin ? '' :
        <FormControl
          style={{marginTop: '1em'}}
          type="search"
          placeholder="Buscar"
          onChange={_handleSerch}
        />
      }
      {loading ? <Loading /> : !isAdmin ?
        <Panel><h4>Hola</h4></Panel>
      :
        <Table responsive hover>
          <thead>
            <tr>
              <th>Email</th>
              <th>Nombre</th>
              {!isAdmin ? '' : <th>Roles</th>}
            </tr>
          </thead>
          <tbody>
            {getUsers(users, roles, isAdmin)}
          </tbody>
        </Table>
      }
    </div>
  )
}

UsersList.propTypes = {
  loading: React.PropTypes.bool,
  users: React.PropTypes.array,
  roles: React.PropTypes.array,
  currentUser: React.PropTypes.string,
  isAdmin: React.PropTypes.bool,
};
