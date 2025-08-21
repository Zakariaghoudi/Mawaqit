
import "./Maincontext.css";

export default function MainContext({prayerData,currentTime, nextPrayer, loading}) {
  if (loading) return <div>Loading...</div>;
  
  return (
    <>
    <div className="current-time">
       {/* date : current day + time */}
     <h2>{currentTime.toLocaleTimeString('fr-FR')}</h2>
     <h3>{prayerData?.date.hijri.date}</h3>
     <h3>{prayerData?.date.readable}</h3>
     
      {/*=== date : current day + time=== */}
    </div>
    <div className="next-prayer">
    <h4>{nextPrayer.name} dans {nextPrayer.countdown}</h4>
    </div>
  </>
)
}
