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
