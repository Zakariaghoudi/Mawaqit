import { useEffect, useState, useRef } from 'react';

const AzanPlayer = ({ prayerTimings }) => {
  const [isMuted, setIsMuted] = useState(true);
  // نستخدم useRef للحفاظ على مرجع الصوت دون إعادة تحميله
  const audioRef = useRef(new Audio("https://islamcan.com/audio/adhan/azan2.mp3"));
  const lastPlayedTime = useRef("");

  const playAzan = () => {
    console.log("محاولة تشغيل الأذان...");
    audioRef.current.currentTime = 0; // البدء من البداية
    audioRef.current.play().catch(err => {
      console.error("فشل التشغيل: تأكد من التفاعل مع الصفحة أولاً", err);
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      // تنسيق الوقت HH:mm ليتوافق مع تنسيق مواقيت الصلاة غالباً
      const currentTime = now.getHours().toString().padStart(2, '0') + ":" + 
                          now.getMinutes().toString().padStart(2, '0');

      if (prayerTimings) {
        const prayers = { 
          "Fajr": prayerTimings.Fajr, 
          "Dhuhr": prayerTimings.Dhuhr, 
          "Asr": prayerTimings.Asr, 
          "Maghrib": prayerTimings.Maghrib, 
          "Isha": prayerTimings.Isha 
        };

        // إذا لم يكن مكتوماً، والوقت الحالي هو وقت صلاة، ولم يشتغل بعد في هذه الدقيقة
        if (!isMuted && Object.values(prayers).includes(currentTime)) {
          if (lastPlayedTime.current !== currentTime) {
            playAzan();
            lastPlayedTime.current = currentTime;
          }
        }
      }
    }, 1000); // فحص كل ثانية لدقة أفضل

    return () => clearInterval(timer);
  }, [prayerTimings, isMuted]);

  const toggleAzan = () => {
    if (isMuted) {
      // طلب إذن الإشعارات
      if ("Notification" in window && Notification.permission !== "granted") {
        Notification.requestPermission();
      }

      // "خدعة" لفتح قناة الصوت: نشغل الصوت ونوقفه فوراً عند ضغطة الزر
      // هذا يجعل المتصفح يثق في أن الموقع مسموح له بإصدار صوت لاحقاً
      audioRef.current.play().then(() => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsMuted(false);
      }).catch(e => console.log("خطأ في تهيئة الصوت:", e));
      
    } else {
      setIsMuted(true);
      audioRef.current.pause();
    }
  };

  return (
    <div style={{ textAlign: 'center', margin: '15px 0' }}>
      <button 
        onClick={toggleAzan}
        style={{
          // تنسيق الزر الخاص بك...
          padding: '12px 24px',
          backgroundColor: isMuted ? '#fdf2f2' : '#f0fdf4',
          cursor: 'pointer',
          borderRadius: '12px',
          border: '1px solid #ccc'
        }}
      >
        {isMuted ? "🔇 تفعيل تنبيهات الأذان" : "🔔 الأذان مفعّل (سيؤذن عند الوقت)"}
      </button>
    </div>
  );
};

export default AzanPlayer;
