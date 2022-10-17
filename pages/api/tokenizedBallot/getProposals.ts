import Cors from "cors";
import "reflect-metadata";
import {container} from "tsyringe";
import { ITokenizedBallotService } from "../../../services/ITokenizedBallotService";
import {TokenizedBallotService} from "../../../services/TokenizedBallotService";


// Initializing the cors middleware
const cors = Cors({
  methods: ["POST", "HEAD"]
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

async function handler(req, res) {
  // Run the middleware
  await runMiddleware(req, res, cors);
  //check the expected method
  if (req.method === "GET") {
    const instance = container.resolve(TokenizedBallotService) as ITokenizedBallotService;
    return res.status(200).json( await instance.getProlposals() );
  }
  return res.status(404).json({
    error: {
      code: "not_found",
      message: "The requested endpoint was not found or doesn't support this method."
    }
  });

}

export default handler;