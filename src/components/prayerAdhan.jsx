import { useEffect, useState } from 'react';

const AzanPlayer = ({ prayerTimings }) => {
  const [isMuted, setIsMuted] = useState(true);

  const playAzan = () => {
    const audio = new Audio("https://www.islamcan.com/audio/adhan/azan1.mp3");
    audio.play().catch(err => console.log(err));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const currentTime = now.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
      });

      if (prayerTimings) {
        const { Fajr, Dhuhr, Asr, Maghrib, Isha } = prayerTimings;
        const timesArray = [Fajr, Dhuhr, Asr, Maghrib, Isha];

        if (timesArray.includes(currentTime) && !isMuted) {
          playAzan();
        }
      }
    }, 60000);

    return () => clearInterval(timer);
  }, [prayerTimings, isMuted]);

  return (
    <div style={{ textAlign: 'center', margin: '20px 0' }}>
      <button 
        onClick={() => {
          setIsMuted(!isMuted);
          if (isMuted) {
            const a = new Audio("https://www.islamcan.com/audio/adhan/azan1.mp3");
            a.volume = 0;
            a.play().then(() => a.pause());
          }
        }}
        style={{
          padding: '12px 24px',
          backgroundColor: isMuted ? '#666' : '#28c76f',
          color: 'white',
          border: 'none',
          borderRadius: '25px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}
      >
        {isMuted ? "🔇 تفعيل الأذان" : "🔔 الأذان مفعّل"}
      </button>
    </div>
  );
};

export default AzanPlayer;
