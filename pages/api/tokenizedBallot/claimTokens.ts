import Cors from "cors";
import { container } from "tsyringe";
import { ITokenizedBallotService } from "../../../services/ITokenizedBallotService";
import { TokenizedBallotService } from "../../../services/TokenizedBallotService";

// Initializing the cors middleware
const cors = Cors({
  methods: ["POST", "HEAD"],
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
  if (req.method === "POST") {
    const instance = container.resolve(
      TokenizedBallotService
    ) as ITokenizedBallotService;
    return res.status(201).json(await instance.claimTokens(req.body));
  }

  return res.status(404).json({
    error: {
      code: "not_found",
      message:
        "The requested endpoint was not found or doesn't support this method.",
    },
  });
}

export default handler;
