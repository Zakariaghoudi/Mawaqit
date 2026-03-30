import { useEffect, useState } from 'react';

const AzanPlayer = ({ prayerTimings }) => {
  const [isMuted, setIsMuted] = useState(true);

  // 1. طلب إذن التنبيهات عند تحميل المكون
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  // 2. دالة إرسال التنبيه النصي
  const sendNotification = (prayerName) => {
    if (Notification.permission === "granted") {
      new Notification(`اقتربت صلاة ${prayerName}`, {
        body: `باقي 5 دقائق على موعد الأذان. حان وقت الوضوء!`,
        icon: "/logo192.png", // تأكد من وجود الأيقونة في مجلد public
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
      
      // الوقت الحالي بتنسيق HH:mm (مثلاً 12:45)
      const currentTime = now.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
      });

      // الوقت بعد 5 دقائق من الآن
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

        // فحص وقت الأذان الفعلي (إذا لم يكن مكتوم الصوت)
        if (!isMuted && Object.values(prayers).includes(currentTime)) {
          playAzan();
        }

        // فحص وقت التنبيه (قبل 5 دقائق) - يعمل دائماً إذا وافق المستخدم على الإشعارات
        Object.entries(prayers).forEach(([name, time]) => {
          if (time === notificationTime) {
            sendNotification(name);
          }
        });
      }
    }, 60000); // يفحص كل دقيقة

    return () => clearInterval(timer);
  }, [prayerTimings, isMuted]);

  const toggleAzan = () => {
    if (isMuted) {
      setIsMuted(false);
      // محاكاة تشغيل لفتح قفل الصوت في المتصفح
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
          color:
