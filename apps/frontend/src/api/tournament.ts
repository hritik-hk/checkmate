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