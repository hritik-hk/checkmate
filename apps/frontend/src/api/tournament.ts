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

export const getTournamentHistory = async (userId: string) => {
  try {
    const resp = await fetch(getUrl("user/tournament_history"), {
      credentials: "include",
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userId }),
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

export const getOnGoingTournament = async (userId: string) => {
  try {
    const resp = await fetch(getUrl(`user/ongoing_tournament`), {
      credentials: "include",
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (!resp.ok) {
      throw new Error("error fetching ongoing tournaments");
    }

    const tournamentInfo = await resp.json();
    return tournamentInfo;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getOnGoingTournamentGames = async (
  tournamentId: string,
  roundId: string
) => {
  try {
    const resp = await fetch(getUrl(`tournament/ongoing_games`), {
      credentials: "include",
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ tournamentId, roundId }),
    });

    if (!resp.ok) {
      throw new Error("error fetching ongoing tournament games");
    }

    const tournamentGames = await resp.json();
    return tournamentGames;
  } catch (err) {
    console.error(err);
    return null;
  }
};
