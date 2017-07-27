import React from 'react';
import { Row, Col } from 'react-bootstrap';
import UsersList from '../containers/users-list.js';

export const Users = () => (
    <Row>
      <Col xs={ 12 }>
        <h4 className="page-header">Usuarios</h4>
        <UsersList />
      </Col>
    </Row>

);
