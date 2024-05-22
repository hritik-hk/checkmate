import { getUrl } from "../utils/helpers";
import { user } from "../interfaces/common";

export const getUserByUsername = async (username: string) => {
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
    return null;
  }
};

export const createFriendRequest = async (request: any) => {
  try {
    const resp = await fetch(getUrl("user/friend_request"), {
      credentials: "include",
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!resp.ok) {
      throw new Error("something went wrong while sending friend request");
    }

    const msg = await resp.json();
    return msg;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const declineFriendRequest = async (request: any) => {
  try {
    const resp = await fetch(getUrl("user/decline_friendship"), {
      credentials: "include",
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!resp.ok) {
      throw new Error("something went wrong while declining friend request");
    }

    const deleted = await resp.json();
    return deleted;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const addFriendship = async (request: any) => {
  try {
    const resp = await fetch(getUrl("user/add_friendship"), {
      credentials: "include",
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!resp.ok) {
      throw new Error("something went wrong while adding friendship");
    }

    const result = await resp.json();
    return result;
  } catch (err) {
    console.log(err);
    return null;
  }
};
