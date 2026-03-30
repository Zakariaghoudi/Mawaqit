import { useEffect, useState } from 'react';

const AzanPlayer = ({ prayerTimings }) => {
  const [isMuted, setIsMuted] = useState(true);

  const playAzan = () => {
    const audio = new Audio("https://www.islamcan.com/audio/adhan/azan1.mp3");
    audio.play().catch(err => console.log("Autoplay pending..."));
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
          playAzan();
        }
      }
    }, 60000);

    return () => clearInterval(timer);
  }, [prayerTimings, isMuted]);

  const toggleAzan = () => {
    if (isMuted) {
      setIsMuted(false);
      // تشغيل صامت لفتح إذن المتصفح دون إصدار صوت الآن
      const silentAudio = new Audio("https://www.islamcan.com/audio/adhan/azan1.mp3");
      silentAudio.volume = 0; 
      silentAudio.play().then(() => {
        setTimeout(() => silentAudio.pause(), 100);
      }).catch(e => console.log(e));
    } else {
      setIsMuted(true);
    }
  };

  return (
    <div style={{ textAlign: 'center', margin: '15px 0' }}>
      <button 
        onClick={toggleAzan}
       style={{
  padding: '8px 16px',
  backgroundColor: isMuted ? '#f0f0f0' : '#e8f5e9', // ألوان باهتة ومريحة
  color: isMuted ? '#666' : '#2e7d32',
  border: `1px solid ${isMuted ? '#ccc' : '#2e7d32'}`,
  borderRadius: '12px', // حواف ناعمة تشبه iOS/Android
  fontSize: '13px',
  fontWeight: '600',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  margin: '10px auto',
  boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
}}

      >
        {isMuted ? "🔇 تفعيل الأذان التلقائي" : "🔔 الأذان مفعّل لمواقيت الصلاة"}
      </button>
    </div>
  );
};

export default AzanPlayer;
