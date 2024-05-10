import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface props {
  countDown?: number;
}

export default function CountDown({ countDown = 120000 }: props) {
  const timeInSec = Math.floor(countDown / 1000);

  const [second, setSecond] = useState(timeInSec);

  const minLeft = Math.floor(second / 60);
  const secLeft = Math.floor(second % 60);

  const timerId = useRef<NodeJS.Timeout | null>(null); // useRef hook to store interval ID

  const stopTimer = () => {
    if (timerId.current) {
      clearInterval(timerId.current);
      timerId.current = null;
    }
  };

  // Todo: problem faced on closures, read about closure
  const startTimer = () => {
    if (!timerId.current) {
      timerId.current = setInterval(() => {
        setSecond((prevSeconds) => {
          if (prevSeconds <= 1) {
            stopTimer();
            return 0;
          } else return prevSeconds - 1;
        });
      }, 1000); // Update every second
    }
  };

  useEffect(() => {
    startTimer();

    return stopTimer;
  }, []);

  return (
    <>
      <div>
        <h1 className="text-2xl tracking-wide font-medium">
          Timeleft: {minLeft < 10 ? `0${minLeft}` : minLeft}:
          {secLeft < 10 ? `0${secLeft}` : secLeft}
        </h1>
        <Button onClick={stopTimer}>Stop Countdown</Button>
      </div>
    </>
  );
}
