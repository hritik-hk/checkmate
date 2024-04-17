import Board from "../components/Board";

export default function Game() {
  return (
    <>
      <div>
        <div className="mb-5">
          <h1 className="text-4xl">GAME IS ON </h1>
        </div>
        <div className="w-[600px] h-[600px]">
          <Board />
        </div>
      </div>
    </>
  );
}
