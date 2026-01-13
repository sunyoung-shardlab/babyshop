import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  endDate: string; // ISO 8601 format
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ endDate, className = '' }) => {
  const calculateTimeLeft = (): TimeLeft => {
    const difference = new Date(endDate).getTime() - new Date().getTime();
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }
    
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      total: difference,
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  // 종료됨
  if (timeLeft.total <= 0) {
    return (
      <span className={`text-gray-400 text-sm ${className}`}>
        판매 종료
      </span>
    );
  }

  // 2일 이상 남음: "N일 후 종료"
  if (timeLeft.days >= 2) {
    return (
      <span className={`text-orange-600 font-medium text-sm ${className}`}>
        {timeLeft.days}일 후 종료
      </span>
    );
  }

  // 2일 미만: "종료까지 HH:MM:SS"
  const formatNumber = (num: number) => String(num).padStart(2, '0');
  
  return (
    <span className={`text-red-600 font-bold text-sm ${className}`}>
      종료까지 {formatNumber(timeLeft.days * 24 + timeLeft.hours)}:
      {formatNumber(timeLeft.minutes)}:
      {formatNumber(timeLeft.seconds)}
    </span>
  );
};
