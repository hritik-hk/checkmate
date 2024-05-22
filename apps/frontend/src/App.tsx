import { useEffect } from "react";
import { useAuth } from "./hooks/auth";
import { getUrl } from "./utils/helpers";
import { useSocket } from "./hooks/socket";
import { FriendEvent, GameEvent, TournamentEvent } from "./utils/constant";
import { createGame } from "./api/game";
import { useNavigate } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { useGame } from "./hooks/game";
import { gameInfoInterface } from "./interfaces/common";
import { Chess } from "chess.js";
import { toast } from "sonner";
import { declineFriendRequest, addFriendship } from "./api/user";

function App() {
  const { isLoggedIn, setIsLoggedIn, setAuthUser, authUser } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();

  const {
    setCurrGameInfo,
    setGameState,
    setMyCountDown,
    setOpponentCountDown,
  } = useGame();

  //TO DO : allow user to accept or decline incoming game request
  const handleGameRequest = async (request: any) => {
    console.log(request);

    const { requestedBy, gameInfo } = request;

    // handle request
    await createGame({ recipientId: requestedBy, ...gameInfo });
  };

  const handleInitGame = (gameId: string) => {
    socket?.emit(GameEvent.INIT_GAME, gameId);
  };

  const handleStartGame = (gameId: string) => {
    navigate(`/game/${gameId}`);
  };

  const handleInitTournament = (tournamentId: string) => {
    socket?.emit(TournamentEvent.INIT_TOURNAMENT, tournamentId);
  };

  const handleStartTournament = (tournamentId: string) => {
    navigate(`/tournament/${tournamentId}`);
  };

  const handleJoinGame = (gameInfo: gameInfoInterface) => {
    console.log("gameInfo", gameInfo);
    const {
      gameDuration,
      boardStatus,
      timeUsedByBlackPlayer,
      timeUsedByWhitePlayer,
      whitePlayer,
    } = gameInfo;

    const myTimeConsumed =
      whitePlayer.id === authUser?.id
        ? timeUsedByWhitePlayer
        : timeUsedByBlackPlayer;

    const opponentTimeConsumed =
      timeUsedByWhitePlayer === myTimeConsumed
        ? timeUsedByBlackPlayer
        : timeUsedByWhitePlayer;

    setCurrGameInfo(gameInfo);
    setGameState(new Chess(boardStatus));
    console.log(
      "my duration",
      Math.floor((gameDuration - myTimeConsumed) / 1000)
    );
    console.log(
      "oppo duration",
      Math.floor((gameDuration - opponentTimeConsumed) / 1000)
    );

    setMyCountDown(Math.floor((gameDuration - myTimeConsumed) / 1000));
    setOpponentCountDown(
      Math.floor((gameDuration - opponentTimeConsumed) / 1000)
    );
  };

  const handleFriendRequest = (request: any) => {
    //todo: add to actions
    console.log(request);
    toast("Friend Request", {
      description: `${request.senderUsername} wants to be friends with you.`,
      action: {
        label: "Accept",
        onClick: async () =>
          await addFriendship({
            senderId: request.senderId,
            receiverId: request.receiverId,
          }),
      },
      cancel: {
        label: "Decline",
        onClick: async () =>
          await declineFriendRequest({
            senderId: request.senderId,
            receiverId: request.receiverId,
          }),
      },
    });
  };

  useEffect(() => {
    fetch(getUrl("auth/check"), {
      credentials: "include" as RequestCredentials,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`some went wrong error code: ${response.status}`);
        }
      })
      .then((respData) => {
        if (respData.token) {
          setIsLoggedIn(true);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, [setIsLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      fetch(getUrl("user/own"), {
        credentials: "include" as RequestCredentials,
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error(`some went wrong error code: ${response.status}`);
          }
        })
        .then((respData) => {
          setAuthUser(respData);
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  }, [isLoggedIn, setAuthUser]);

  //socket events
  useEffect(() => {
    if (socket === null) return;

    //set up event listeners for various socket events
    socket.on(GameEvent.GAME_REQUEST, handleGameRequest);
    socket.on(GameEvent.START_GAME, handleStartGame);
    socket.on(GameEvent.INIT_GAME, handleInitGame);
    socket.on(GameEvent.JOIN_GAME, handleJoinGame);
    socket.on(TournamentEvent.INIT_TOURNAMENT, handleInitTournament);
    socket.on(TournamentEvent.START_TOURNAMENT, handleStartTournament);
    socket.on(FriendEvent.FRIEND_REQUEST, handleFriendRequest);

    //remove all the event listeners  -imp clean-up function
    return () => {
      socket.off(GameEvent.GAME_REQUEST, handleGameRequest);
      socket.off(GameEvent.START_GAME, handleStartGame);
      socket.off(GameEvent.INIT_GAME, handleInitGame);
      socket.off(GameEvent.JOIN_GAME, handleJoinGame);
      socket.off(TournamentEvent.INIT_TOURNAMENT, handleInitTournament);
      socket.off(TournamentEvent.START_TOURNAMENT, handleStartTournament);
      socket.off(FriendEvent.FRIEND_REQUEST, handleFriendRequest);
    };
  }, [socket]);

  return (
    <>
      <AppRoutes />
    </>
  );
}

export default App;
