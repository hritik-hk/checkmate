import crypto from "crypto";
import jwt from "jsonwebtoken";
import { IUser, hashPasswordType, jwtResponse } from "../interfaces/common.js";

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

function issueJWT(user: IUser): jwtResponse {
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

export { issueJWT, genPassword, validPassword };
