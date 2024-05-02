import crypto from "crypto";
import jwt from "jsonwebtoken";
import { hashPasswordType, jwtResponse } from "../interfaces/common.js";
import { GameStatus } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { IRound } from "../interfaces/common.js";

function genPassword(password: string): hashPasswordType {
  const salt = crypto.randomBytes(32);
  const genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512");

  return {
    salt: salt.toString("base64"),
    hash: genHash.toString("base64"),
  };
}

function validPassword(password: string, hash: string, salt: string): boolean {
  // Hash user-entered password using PBKDF2 with SHA-512, generating a Buffer
  const hashedPassword = crypto.pbkdf2Sync(
    password,
    Buffer.from(salt, "base64"),
    10000,
    64,
    "sha512"
  );
  return crypto.timingSafeEqual(hashedPassword, Buffer.from(hash, "base64"));
}

function issueJWT(user: { id: string }): jwtResponse {
  const expiresIn = parseInt(process.env.JWT_EXPIRY as string);
  const jwt_secret = process.env.ACCESS_TOKEN_SECRET as string;

  const payload = {
    userId: user.id,
  };

  const signedToken = jwt.sign(payload, jwt_secret, {
    expiresIn: expiresIn,
  });

  return {
    token: signedToken,
    expires: expiresIn,
  };
}

function createSingleRoundRobin(
  participants: string[],
  tournamentId: string,
  matchType: string
) {
  let numPlayers = participants.length;
  const rounds = []; // to store each round data
  const tournamentGames = []; // to store all tournament games

  // creating even number of players for round robin by adding "bye"
  if (numPlayers % 2 !== 0) {
    participants.push("BYE");
    numPlayers++;
  }

  const numRounds = numPlayers - 1; // num of rounds
  const halfNumPlayers = numPlayers / 2;
  const breakBtwRounds = 120000; // 2 min
  const matchDuration = matchType === "BLITZ" ? 360000 : 600000; // 6min or 10min

  const playerIndexes = Array.from({ length: numPlayers }, (_, i) => i);

  for (let round = 1; round <= numRounds; round++) {
    // const roundMatches = [];
    const half1 = playerIndexes.slice(0, halfNumPlayers);
    const half2 = playerIndexes.slice(halfNumPlayers).reverse();
    const roundId = uuidv4();

    const currRound: IRound = {
      id: roundId,
      roundNumber: round,
      tournamentId,
      startTime:
        Date.now() + round * breakBtwRounds + (round - 1) * matchDuration,
      endTime: Date.now() + round * (breakBtwRounds + matchDuration),
    };

    for (let i = 0; i < halfNumPlayers; i++) {
      const player1 = participants[half1[i] as number];
      const player2 = participants[half2[i] as number];

      if (player1 !== "BYE" && player2 != "BYE") {
        const game = {
          whitePlayerId: player1 as string,
          blackPlayerId: player2 as string,
          tournamentId,
          status: GameStatus.IN_PROGRESS,
          roundId: roundId,
        };

        tournamentGames.push(game);
      } else {
        const bye = player1 === "BYE" ? player2 : player1;
        currRound.bye = bye;
      }
    }

    rounds.push(currRound);

    // Rotate playerIndexes array for next round
    const last: number = playerIndexes.pop() as number;
    playerIndexes.splice(1, 0, last);
  }

  return {
    rounds,
    tournamentGames,
  };
}

export { issueJWT, genPassword, validPassword, createSingleRoundRobin };
