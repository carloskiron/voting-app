import Head from 'next/head'
import { useEffect, useState } from 'react';
import { Container, Row, Card, Button } from 'react-bootstrap'

export default function ProposalList({ proposals }) {

  return (
    <ul>
      {proposals?.length > 0 ? proposals.map((proposal, index) =>
        <li key={index}>
          {proposal.name}
        </li>
      ) : <li>No proposals</li>}
    </ul>
  )
}
