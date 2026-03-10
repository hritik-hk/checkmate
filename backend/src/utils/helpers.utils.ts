import crypto from "crypto";
import jwt from "jsonwebtoken";
import { IRound, hashPasswordType, jwtResponse } from "../interfaces/common.js";
import { Status } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { Chess, Square, Piece } from "chess.js";
import { GameType } from "@prisma/client";

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
  gameType: GameType,
  gameDuration: number
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
  const roundDuration = gameDuration * 2;

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
      startTime: (
        Date.now() +
        round * breakBtwRounds +
        (round - 1) * roundDuration
      ).toString(),
      endTime: (
        Date.now() +
        round * (breakBtwRounds + roundDuration)
      ).toString(),
    };

    for (let i = 0; i < halfNumPlayers; i++) {
      const player1 = participants[half1[i] as number];
      const player2 = participants[half2[i] as number];

      if (player1 !== "BYE" && player2 != "BYE") {
        const game = {
          whitePlayerId: player1 as string,
          blackPlayerId: player2 as string,
          tournamentId,
          status: Status.IN_PROGRESS,
          gameType,
          gameDuration,
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

// for checking if pawn could be promoted
const checkPromotion = (chess: Chess, from: Square, to: Square) => {
  if (!from) {
    return false;
  }

  const piece = chess.get(from);

  if (piece?.type !== "p") {
    return false;
  }

  if (piece.color !== chess.turn()) {
    return false;
  }

  if (!["1", "8"].some((it) => to.endsWith(it))) {
    return false;
  }

  return chess
    .moves({ square: from, verbose: true })
    .map((it) => it.to)
    .includes(to);
};

function calExpectedScore(ratingA: number, ratingB: number) {
  const ratingDiff = ratingB - ratingA;
  const expo = ratingDiff / 400;
  let result;
  if (expo < 0) {
    result = Math.pow(1 / 10, Math.abs(expo));
  } else {
    result = Math.pow(10, expo);
  }

  let expectedScore = 1 / (result + 1);
  return expectedScore;
}

function calNewRating(
  oldRating: number,
  actualScore: number,
  expectedScore: number,
  factor: number
) {
  return oldRating + factor * (actualScore - expectedScore);
}

export {
  issueJWT,
  genPassword,
  validPassword,
  createSingleRoundRobin,
  checkPromotion,
  calExpectedScore,
  calNewRating,
};
