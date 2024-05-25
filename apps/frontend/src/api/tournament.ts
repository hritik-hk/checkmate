import { getUrl } from "@/utils/helpers";

export const getPointsTable = async (tournamentId: string) => {
  try {
    const response = await fetch(getUrl(`tournament/points`), {
      credentials: "include",
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ tournamentId }),
    });

    if (!response.ok) {
      throw new Error("some error occurred!");
    }

    const data = await response.json();

    return data;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const getFixture = async (tournamentId: string) => {
  try {
    const response = await fetch(getUrl(`tournament/fixture`), {
      credentials: "include",
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ tournamentId }),
    });

    if (!response.ok) {
      throw new Error("some error occurred!");
    }

    const data = await response.json();

    return data;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const getTournamentHistory = async (username: string) => {
  try {
    const resp = await fetch(getUrl("tournament/history"), {
      credentials: "include",
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username }),
    });

    if (!resp.ok) {
      throw new Error("something went wrong while fetching tournament history");
    }

    const data = await resp.json();
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const createTournament = async ({
  participants,
  gameType,
  gameDuration,
}: {
  participants: string[];
  gameType: string;
  gameDuration: number;
}) => {
  try {
    const response = await fetch(getUrl(`tournament/new`), {
      credentials: "include",
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ participants, gameType, gameDuration }),
    });

    if (!response.ok) {
      throw new Error("something went wrong while creating tournament");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};
