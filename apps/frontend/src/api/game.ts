import { getUrl } from "../utils/helpers";

export const createGame = async (data: any) => {
  try {
    console.log(data);
    const resp = await fetch(getUrl(`game/new`), {
      credentials: "include",
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!resp.ok) {
      throw new Error("user not found");
    }

    const game = await resp.json();
    return game;
  } catch (err) {
    console.error(err);
  }
};

export const startRandomGame = async (data: {
  gameType: string;
  gameDuration: number;
}) => {
  try {
    const resp = await fetch(getUrl(`game/random`), {
      credentials: "include",
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!resp.ok) {
      throw new Error("some error occurred, try again");
    }

    const msg = await resp.json();
    return msg;
  } catch (err) {
    console.log(err);
  }
};

export const getGamesHistory = async (username: string) => {
  try {
    const resp = await fetch(getUrl("user/game_history"), {
      credentials: "include",
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username }),
    });

    if (!resp.ok) {
      throw new Error("something went wrong white fetch games history");
    }

    const data = await resp.json();
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getOnGoingGame = async (userId: string) => {
  try {
    const resp = await fetch(getUrl(`user/ongoing_game`), {
      credentials: "include",
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (!resp.ok) {
      throw new Error("error fetching on going games");
    }

    const gameInfo = await resp.json();
    return gameInfo;
  } catch (err) {
    console.error(err);
    return null;
  }
};
