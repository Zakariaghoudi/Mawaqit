import { useEffect, useState } from 'react';

const AzanPlayer = ({ prayerTimings }) => {
  const [isMuted, setIsMuted] = useState(true);

  const playSound = () => {
    const audio = new Audio("https://www.islamcan.com/audio/adhan/azan1.mp3");
    audio.play().catch(err => console.error("Autoplay blocked:", err));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const currentTime = now.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
      });

      if (prayerTimings && !isMuted) {
        const { Fajr, Dhuhr, Asr, Maghrib, Isha } = prayerTimings;
        const timesArray = [Fajr, Dhuhr, Asr, Maghrib, Isha];

        if (timesArray.includes(currentTime)) {
          playSound();
        }
      }
    }, 60000);

    return () => clearInterval(timer);
  }, [prayerTimings, isMuted]);

  const toggleAzan = () => {
    if (isMuted) {
      setIsMuted(false);
      playSound(); // يؤذن فوراً عند التفعيل للتجربة وفتح إذن المتصفح
    } else {
      setIsMuted(true);
    }
  };

  return (
    <div style={{ textAlign: 'center', margin: '15px 0' }}>
      <button 
        onClick={toggleAzan}
        style={{
          padding: '10px 20px',
          backgroundColor: isMuted ? '#555' : '#28c76f',
          color: 'white',
          border: 'none',
          borderRadius: '20px',
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: '0.3s'
        }}
      >
        {isMuted ? "🔇 تفعيل واختبار الأذان" : "🔔 الأذان مفعّل"}
      </button>
    </div>
  );
};

export default AzanPlayer;
