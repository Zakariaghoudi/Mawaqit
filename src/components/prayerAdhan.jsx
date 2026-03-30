import { useEffect, useState } from 'react';

const AzanPlayer = ({ prayerTimings }) => {
  const [isMuted, setIsMuted] = useState(true);

  // دالة إرسال التنبيه النصي
  const sendNotification = (prayerName) => {
    if (Notification.permission === "granted") {
      new Notification(`اقتربت صلاة ${prayerName}`, {
        body: `باقي 5 دقائق على موعد الأذان. حان وقت الوضوء!`,
        icon: "/logo192.png",
      });
    }
  };

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

      const fiveMinutesLater = new Date(now.getTime() + 5 * 60000);
      const notificationTime = fiveMinutesLater.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
      });

      if (prayerTimings) {
        const { Fajr, Dhuhr, Asr, Maghrib, Isha } = prayerTimings;
        const prayers = { 
          "الفجر": Fajr, 
          "الظهر": Dhuhr, 
          "العصر": Asr, 
          "المغرب": Maghrib, 
          "العشاء": Isha 
        };

        if (!isMuted && Object.values(prayers).includes(currentTime)) {
          playAzan();
        }

        Object.entries(prayers).forEach(([name, time]) => {
          if (time === notificationTime) {
            sendNotification(name);
          }
        });
      }
    }, 60000);

    return () => clearInterval(timer);
  }, [prayerTimings, isMuted]);

  const toggleAzan = () => {
    // طلب إذن الإشعارات عند التفاعل (ضروري للآيفون)
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    if (isMuted) {
      setIsMuted(false);
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
          padding: '10px 20px',
          backgroundColor: isMuted ? '#fdf2f2' : '#f0fdf4',
          color: isMuted ? '#991b1b' : '#166534',
          border: `1px solid ${isMuted ? '#fecaca' : '#bbf7d0'}`,
          borderRadius: '16px',
          fontSize: '14px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          margin: '10px auto',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
          cursor: 'pointer'
        }}
      >
        <span>{isMuted ? "🔇" : "🔔"}</span>
        {isMuted ? "تفعيل صوت الأذان والإشعارات" : "الأذان والتنبيهات مفعّلة"}
      </button>
    </div>
  );
};

export default AzanPlayer;
