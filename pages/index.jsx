import { ethers } from "ethers";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Container, Row, Card, Button } from "react-bootstrap";
import ProposalList from "../components/proposalList.jsx";

export default function Home() {
  const [proposals, setProposals] = useState([]);
  const [name, setName] = useState("");
  const [tokensMinted, setTokenMinted] = useState(false);
  const [loadingProposals, setLoadingProposals] = useState(true);

  const [isConnected, setIsConnected] = useState(false);
  const [signer, setSigner] = useState(undefined);

  async function connect() {
    console.info("connecting to metamask");
    if (typeof window.ethereum !== "undefined") {
      try {
        await ethereum.request({ method: "eth_requestAccounts" });
        setIsConnected(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setSigner(provider.getSigner());
      } catch (e) {
        console.log(e);
      }
    } else {
      setIsConnected(false);
    }
  }

  const loadProposals = async () => {
    const result = await fetch("/api/tokenizedBallot/getProposals");
    const data = await result.json();
    setProposals(data);
    setLoadingProposals(false);
  };
  const requestTokens = async () => {
    if (!isConnected || !signer) {
      return;
    }
    const message = JSON.stringify({ name });
    const signature = await signer.signMessage(message);
    const result = await fetch("/api/tokenizedBallot/claimTokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        signature,
      }),
    });
    const data = await result.json();
    setTokenMinted(data.result);
  };

  const handleChange = (event) => {
    setName(event.target.value);
  };

  useEffect(() => {
    connect();
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
                  {loadingProposals
                    ? "Loading proposals..."
                    : "Current voting proposals:"}
                </Card.Text>
                {!loadingProposals && <ProposalList proposals={proposals} />}
              </Card.Body>
            </Card>
            <Card className="sml-card">
              <Card.Body>
                <Card.Title>Recent votes</Card.Title>
                <Card.Text>Last on-chain votes:</Card.Text>
              </Card.Body>
            </Card>
          </Row>
          <Row className="justify-content-md-between">
            <Card className="sml-card">
              <Card.Body>
                <Card.Title>Voting tokens</Card.Title>
                <Card.Text>Request voting tokens.</Card.Text>
                <form>
                  <label>
                    Name:
                    <input type="text" value={name} onChange={handleChange} />
                  </label>
                  <Button
                    variant="primary"
                    type="button"
                    onClick={requestTokens}
                  >
                    Mint &rarr;
                  </Button>
                </form>
              </Card.Body>
            </Card>
            <Card className="sml-card">
              <Card.Body>
                <Card.Title>Vote</Card.Title>
                <Card.Text>Cast your vote!</Card.Text>
                <Button variant="primary" href="#">
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
          Powered by{" "}
          <span className="text-secondary">Group 2 - Solidity Bootcamp</span>
        </a>
      </footer>
    </Container>
  );
}
