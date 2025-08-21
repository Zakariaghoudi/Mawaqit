// src/components/PrayerWidget.jsx

import React, { useState, useEffect } from 'react';

// === الإعدادات الأساسية ===
// يمكنك تغيير المدينة والبلد هنا
const city = "Ghannouch";
const country = "Tunisia";
const prayerMethod = 5; // طريقة الحساب (5 -> UOIF, مناسب لتونس)

const PrayerWidget = () => {
  // === إدارة الحالة (State) ===
  const [prayerData, setPrayerData] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayer, setNextPrayer] = useState({ name: 'Loading...', time: '', countdown: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // === جلب البيانات من API عند تحميل المكون ===
  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const response = await fetch(`http://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=${prayerMethod}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPrayerData(data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, []);

  // === تحديث الساعة كل ثانية ===
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // تنظيف المؤقت عند إزالة المكون لمنع تسرب الذاكرة
    return () => clearInterval(timer);
  }, []);

  // === حساب الصلاة القادمة والوقت المتبقي ===
  useEffect(() => {
    if (prayerData) {
      const prayerTimes = prayerData.timings;
      const now = new Date();

      const prayerList = [
        { name: "Fajr", time: prayerTimes.Fajr },
        { name: "Dhuhr", time: prayerTimes.Dhuhr },
        { name: "Asr", time: prayerTimes.Asr },
        { name: "Maghrib", time: prayerTimes.Maghrib },
        { name: "Isha", time: prayerTimes.Isha },
      ];
      
      let nextPrayerFound = null;

      for (const prayer of prayerList) {
        const [hour, minute] = prayer.time.split(':');
        const prayerTime = new Date();
        prayerTime.setHours(hour, minute, 0, 0);

        if (prayerTime > now) {
          nextPrayerFound = { name: prayer.name, time: prayer.time, date: prayerTime };
          break;
        }
      }

      // إذا فاتت كل صلوات اليوم، فالصلاة التالية هي الفجر
      if (!nextPrayerFound) {
        const [hour, minute] = prayerList[0].time.split(':');
        const tomorrowFajr = new Date();
        tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
        tomorrowFajr.setHours(hour, minute, 0, 0);
        nextPrayerFound = { name: prayerList[0].name, time: prayerList[0].time, date: tomorrowFajr };
      }

      // حساب الوقت المتبقي
      const diff = nextPrayerFound.date.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setNextPrayer({
        name: nextPrayerFound.name,
        time: nextPrayerFound.time,
        countdown: `${hours}h ${minutes}min`
      });
    }
  }, [currentTime, prayerData]); // يتم إعادة الحساب كل ثانية

  // === عرض رسائل التحميل أو الخطأ ===
  if (loading) return <div>Loading prayer times...</div>;
  if (error) return <div>Error: {error}</div>;

  // === عرض الواجهة الرسومية ===
  return (
    <div className="prayer-widget">
      <div className="main-info">
        <div className="time">{currentTime.toLocaleTimeString('fr-FR')}</div>
        <div className="date hijri">{prayerData?.date.hijri.day} {prayerData?.date.hijri.month.en} {prayerData?.date.hijri.year}</div>
        <div className="date gregorian">{prayerData?.date.readable}</div>
      </div>

      <div className="next-prayer-info">
        {nextPrayer.name} dans {nextPrayer.countdown}
      </div>

      <div className="prayer-list">
        <div className="prayer-item"><span>Fajr</span> <span>{prayerData?.timings.Fajr}</span></div>
        <div className="prayer-item"><span>Dhuhr</span> <span>{prayerData?.timings.Dhuhr}</span></div>
        <div className="prayer-item"><span>Asr</span> <span>{prayerData?.timings.Asr}</span></div>
        <div className="prayer-item"><span>Maghrib</span> <span>{prayerData?.timings.Maghrib}</span></div>
        <div className="prayer-item"><span>Isha</span> <span>{prayerData?.timings.Isha}</span></div>
      </div>
      
      <div className="footer-info">
        <div className="prayer-item"><span>Jumua: {prayerData?.timings.Dhuhr}</span> <span>Chourouk: {prayerData?.timings.Sunrise}</span></div>
      </div>
    </div>
  );
};

export default PrayerWidget;