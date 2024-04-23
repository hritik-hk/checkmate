import { getUrl } from "../utils/helpers";

export const createGame = async ({ id }: { id: string }) => {
  try {
    const resp = await fetch(getUrl(`game/new/${id}`), {
      credentials: "include",
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

export const startRandomGame = async () => {
  try {
    const resp = await fetch(getUrl("game/random"), {
      credentials: "include",
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
