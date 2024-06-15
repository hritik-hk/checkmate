import { getUrl } from "../utils/helpers";
import { IUser } from "../interfaces/common";

export const getUserByUsername = async (username: string) => {
  try {
    const resp = await fetch(getUrl(`user/${username}`), {
      credentials: "include",
    });

    if (!resp.ok) {
      throw new Error("user not found");
    }

    const user: IUser = await resp.json();
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

export const getFriendRequests = async () => {
  try {
    const resp = await fetch(getUrl("user/recieved_requests"), {
      credentials: "include",
    });

    if (!resp.ok) {
      throw new Error("error fetching recieved friend requests");
    }

    const data = await resp.json();

    return data;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const getSentRequests = async () => {
  try {
    const resp = await fetch(getUrl("user/sent_requests"), {
      credentials: "include",
    });

    if (!resp.ok) {
      throw new Error("error fetching sent friend requests");
    }

    const data = await resp.json();

    return data;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const logout = async () => {
  try {
    const response = await fetch(getUrl("auth/logout"), {
      credentials: "include",
    });
    if (!response.ok) {
      const message = "something went wrong, try again";
      throw new Error(message);
    }

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
