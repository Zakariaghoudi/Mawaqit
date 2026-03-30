import { useEffect, useState } from 'react';

const AzanPlayer = ({ prayerTimings }) => {
  const [isMuted, setIsMuted] = useState(true);

  const playAzan = () => {
    // نستخدم الرابط المباشر لضمان وجود صوت حقيقي
    const audio = new Audio("https://www.islamcan.com/audio/adhan/azan1.mp3");
    audio.play().catch(err => console.log("تحتاج لتفاعل المستخدم أولاً"));
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
        // الصلوات التي نريد التنبيه لها
        const { Fajr, Dhuhr, Asr, Maghrib, Isha } = prayerTimings;
        const timesArray = [Fajr, Dhuhr, Asr, Maghrib, Isha];

        if (timesArray.includes(currentTime) && !isMuted) {
          playAzan();
        }
      }
    }, 60000); // يفحص كل دقيقة

    return () => clearInterval(timer);
  }, [prayerTimings, isMuted]);

  return (
    <div style={{ textAlign: 'center', margin: '20px 0' }}>
      <button 
        onClick={() => {
          setIsMuted(!isMuted);
          // تشغيل صامت لمرة واحدة لفتح إذن المتصفح
          if (isMuted) {
            const a = new Audio("https://www.islamcan.com/audio/adhan/azan1.mp3");
            a.volume = 0;
            a.play().then(() => a.pause());
          }
        }}
        style={{
          padding: '10px 20px',
          backgroundColor: isMuted ? '#666' : '#1a2a6c',
          color: 'white',
          border: 'none',
          borderRadius: '20px',
          cursor: 'pointer'
        }}
      >
        {isMuted ? "🔇 تشغيل صوت الأذان" : "🔊 الأذان مفعّل"}
      </button>
    </div>
  );
};

export default AzanPlayer;
