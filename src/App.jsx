import "./App.css";
import { useState, useEffect } from "react";
import MainContext from "./components/MainContext";
import Prayers from "./components/Prayers";

function App() {
    
    const city = "Ghannouch";
    const country = "Tunisia";
    const prayerMethod = 5; 

    const [prayerData, setPrayerData] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [nextPrayer, setNextPrayer] = useState({ name: 'Loading...', time: '', countdown: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
   //import prayerData from api 
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
  
    // === update hour every sec ===
    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
  
      return () => clearInterval(timer);
    }, []);
//calculate next prayer + the countdown
      useEffect(() => {
        if (prayerData) {
          const timings = prayerData.timings;
          const now = new Date();
          const prayerList = [
        { name: "Fajr", time: timings.Fajr },
        { name: "Dhuhr", time: timings.Dhuhr },
        { name: "Asr", time: timings.Asr },
        { name: "Maghrib", time: timings.Maghrib },
        { name: "Isha", time: timings.Isha },
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
  }, [currentTime, prayerData]); 

  if (loading) return <div>Loading prayer times...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <div className="app">
      <div className="header">
      <MainContext 
      prayerData={prayerData}
      currentTime={currentTime}
      nextPrayer={nextPrayer}
      loading={loading}
       />
      </div>
      <div className="prayers">
      <Prayers
      loading={loading}
      error={error}
      prayerData={prayerData}
      />
    </div>
    </div>
  );
}

export default App;
