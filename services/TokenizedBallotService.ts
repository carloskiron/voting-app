import { ethers } from "ethers";
import tokenJSON from "../assets/MyERC20Votes.json";
import tokenizedBallotJSON from "../assets/TokenizedBallot.json";
import { ITokenizedBallotService } from "./ITokenizedBallotService";
import { injectable } from "tsyringe";

const MTOKEN_ADDRESS = "0xbed2B6C106a1b60D1a63FD71a4bc24cB8D8808cc"; // MyToken
const TBALLOT_ADDRESS = "0x79AA6C0376a693D66EC6c7347c9c1E19a9f7D283"; // TokenizedBallot
const MTOKEN_ABI = tokenJSON.abi; // MyToken contract ABI
const TBALLOT_ABI = tokenizedBallotJSON.abi; // TokenizedBallot contract ABI
const NUMBER_PROPOSALS = 3;

@injectable()
export class TokenizedBallotService implements ITokenizedBallotService {
  // init
  provider: ethers.providers.Provider;
  myTokenContract: ethers.Contract;
  myTokenSignedContract: ethers.Contract;
  tokenizedBallotContract: ethers.Contract;
  tokenizedBallotSignedContract: ethers.Contract;

  constructor() {
    this.provider = ethers.getDefaultProvider("goerli");
    this.myTokenContract = new ethers.Contract(
      MTOKEN_ADDRESS,
      MTOKEN_ABI,
      this.provider
    );
    this.tokenizedBallotContract = new ethers.Contract(
      TBALLOT_ADDRESS,
      TBALLOT_ABI,
      this.provider
    );
    const private_key = process.env.PRIVATE_KEY;
    const wallet = new ethers.Wallet(private_key, this.provider);
    const signer = wallet.connect(this.provider);
    this.myTokenSignedContract = this.myTokenContract.connect(signer);
    this.tokenizedBallotSignedContract =
      this.tokenizedBallotContract.connect(signer);
  }

  async claimTokens(body: any) {
    const { message, signature } = body;
    console.info({ message, signature });
    let address: string;
    try {
      address = ethers.utils.verifyMessage(message, signature); //
    } catch (err) {
      return {
        result: false,
      };
    }
    const tx = await this.myTokenSignedContract.mint(
      address,
      ethers.utils.parseEther("1.0")
    );
    return {
      result: true,
    };
  }

  async delegate(to: string) {
    // delegate voting power here!
    const tx = await this.myTokenSignedContract.delegate(to);
    return tx;
  }

  async vote(proposal: number, amt: number) {
    // vote here!
    const tx = await this.tokenizedBallotSignedContract.vote(
      proposal,
      ethers.utils.parseEther(amt.toString())
    );
    return tx;
  }

  async getVotePower(address: string) {
    // get vote power here!
    return this.tokenizedBallotSignedContract.votePower(address); // returns a BigNumber in hex format
  }

  async getProlposals() {
    // get proposals here!
    const proposals = [];
    for (let i = 0; i < NUMBER_PROPOSALS; i++) {
      const proposal = await this.tokenizedBallotSignedContract.proposals(i);
      proposals.push({
        name: ethers.utils.parseBytes32String(proposal.name),
        voteCount: ethers.utils.formatEther(proposal.voteCount),
      });
    }
    return proposals; // returns an array of Proposal objects
  }
}
