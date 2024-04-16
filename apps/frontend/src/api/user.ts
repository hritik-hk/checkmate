import { getUrl } from "../utils/helpers";
import { user } from "../interfaces/common";

export const getUserByUsername = async ({ username }: { username: string }) => {
  try {
    const resp = await fetch(getUrl(`user/${username}`), {
      credentials: "include",
    });

    if (!resp.ok) {
      throw new Error("user not found");
    }

    const user: user = await resp.json();
    return user;
  } catch (err) {
    console.error(err);
  }
};

