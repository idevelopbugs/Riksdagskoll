import React from 'react';
import {Col} from 'react-bootstrap';
import './card.css';

const Card = ({tilltalsnamn, efternamn, img, status, missions, year_born})  => (
  <Col sm={3} className="card">
    <div className="text-center">
      <img src={img} alt="foto"/>
      <h4>{tilltalsnamn + ' ' + efternamn}</h4>
    </div>

    <ul className="list-unstyled">
      <li><b>Född:</b> {year_born}</li>
      <li><b>Status:</b> {status}</li>
      <li><b>Antal uppdrag:</b> {missions.length}</li>
    </ul>
  </Col>
);

export default Card;

