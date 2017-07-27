import React from 'react';
import { ListGroup, Alert } from 'react-bootstrap';
import { Document } from './document.js';
import { Loading } from './loading.js';

const renderDocumentsList = (documents) => {
  return documents.length > 0 ?
    <ListGroup className="documents-list">
      {documents.map((doc) => (
        <Document key={ doc._id } document={ doc } />
      ))}
    </ListGroup>
  :
    <Alert bsStyle="warning">No documents yet.</Alert>
}


export const DocumentsList = ({ loading, documents }) => {
  return loading ? <Loading /> : renderDocumentsList(documents)
};

DocumentsList.propTypes = {
  loading: React.PropTypes.bool,
  documents: React.PropTypes.array,
};
