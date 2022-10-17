export interface ITokenizedBallotService {
  claimTokens: (body: any) => any;
  delegate: (to: string) => any;
  vote: (proposal: number, amt: number) => any;
  getVotePower: (address: string) => any;
  getProlposals: () => any;
}
