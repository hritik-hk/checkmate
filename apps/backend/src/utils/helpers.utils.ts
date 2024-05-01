import crypto from "crypto";
import jwt from "jsonwebtoken";
import { hashPasswordType, jwtResponse } from "../interfaces/common.js";
import { v4 as uuidv4 } from "uuid";
import { GameStatus } from "@prisma/client";

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
  const matches = []; // to store each round matches
  const games = []; // to store all match games
  const allRoundGames = []; // to store all round games -- database purpose

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
    const roundMatches = [];
    const half1 = playerIndexes.slice(0, halfNumPlayers);
    const half2 = playerIndexes.slice(halfNumPlayers).reverse();

    for (let i = 0; i < halfNumPlayers; i++) {
      const player1 = participants[half1[i] as number];
      const player2 = participants[half2[i] as number];

      if (player1 !== "BYE" && player2 != "BYE") {
        const dbGame = {
          id: uuidv4(),
          whitePlayerId: player1 as string,
          blackPlayerId: player2 as string,
          tournamentId,
          status: GameStatus.IN_PROGRESS,
        };

        games.push(dbGame);

        const match = {
          roundNumber: round,
          tournamentId,
          gameId: dbGame.id,
          startTime:
            Date.now() + round * breakBtwRounds + (round - 1) * matchDuration,
          endTime: Date.now() + round * (breakBtwRounds + matchDuration),
        };
        roundMatches.push(match);
        allRoundGames.push(match);
      }
    }

    matches.push(roundMatches);

    // Rotate playerIndexes array for next round
    const last: number = playerIndexes.pop() as number;
    playerIndexes.splice(1, 0, last);
  }

  return {
    rounds: matches,
    games: games,
    allRoundGames,
  };
}

export { issueJWT, genPassword, validPassword, createSingleRoundRobin };
