export interface ITokenizedBallotService {
    mintTokens: (to: string, amt: number) => any;
    delegate: (to: string) => any;
    vote:  (proposal: number, amt: number) => any;
    getVotePower: (address: string) => any;
    getProlposals: () => any;
}