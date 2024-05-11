interface CountDownProps {
  minLeft: number;
  secLeft: number;
}

export default function CountDown({ minLeft, secLeft }: CountDownProps) {
  return (
    <>
      <span className="text-white text-3xl p-2 rounded-md tracking-wide font-medium bg-gray-500">
        {minLeft < 10 ? `0${minLeft}` : minLeft}:
        {secLeft < 10 ? `0${secLeft}` : secLeft}
      </span>
    </>
  );
}
