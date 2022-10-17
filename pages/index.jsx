import Head from 'next/head'
import { useEffect, useState } from 'react';
import { Container, Row, Card, Button } from 'react-bootstrap'
import ProposalList from '../components/ProposalList';

export default function Home() {

  const [proposals, setProposals] = useState([]);
  const [loadingProposals, setLoadingProposals] = useState(true);

  const loadProposals = async () => {
    const result = await fetch("/api/tokenizedBallot/getProposals");
    const data = await result.json();
    setProposals(data);
    setLoadingProposals(false);
  }

  useEffect(() => {
    loadProposals();
  }, []);

  return (
    <Container className="md-container">
      <Head>
        <title>Tokenized Ballot Dapp</title>
        <link rel="icon" href="/favicon-32x32.png" />
      </Head>
      <Container>
        <h1>
          Welcome to <a href="#">Tokenized Ballot</a>
        </h1>
        <Container>
          <Row className="justify-content-md-between">
            <Card className="sml-card">
              <Card.Body>
                <Card.Title>Proposals</Card.Title>
                <Card.Text>
                  {loadingProposals ? "Loading proposals..." : "Current voting proposals:"}
                </Card.Text>
                {!loadingProposals && <ProposalList proposals={proposals} />}
              </Card.Body>
            </Card>
            <Card className="sml-card">
              <Card.Body>
                <Card.Title>Recent votes</Card.Title>
                <Card.Text>
                  Last on-chain votes:
                </Card.Text>
              </Card.Body>
            </Card>
          </Row>
          <Row className="justify-content-md-between">
            <Card className="sml-card">
              <Card.Body>
                <Card.Title>Voting tokens</Card.Title>
                <Card.Text>
                  Request voting tokens.
                </Card.Text>
                <Button
                  variant="primary"
                  href="#"
                >
                  Mint &rarr;
                </Button>
              </Card.Body>
            </Card>
            <Card className="sml-card">
              <Card.Body>
                <Card.Title>Vote</Card.Title>
                <Card.Text>
                  Cast your vote!
                </Card.Text>
                <Button variant="primary"  href="#">
                  Vote &rarr;
                </Button>
              </Card.Body>
            </Card>
          </Row>
        </Container>
      </Container>

      <footer className="cntr-footer">
        <a
          href="https://vercel.com?filter=next.js&utm_source=github&utm_medium=example&utm_campaign=next-example"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '} <span className='text-secondary'>Group 2 - Solidity Bootcamp</span>
        </a>
      </footer>
    </Container>
  )
}
