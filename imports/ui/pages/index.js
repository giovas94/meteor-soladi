import React from 'react';
import { Jumbotron } from 'react-bootstrap';

export const Index = () => (
  <Jumbotron className="text-center">
    <h2>&THORN;Vert App</h2>
    <p>Condominium management system.</p>
    <p><a className="btn btn-success" href="#" role="button">Read the Documentation</a></p>
    <p style={ { fontSize: '16px', color: '#aaa' } }>Currently at v0.0.4</p>
  </Jumbotron>
);
