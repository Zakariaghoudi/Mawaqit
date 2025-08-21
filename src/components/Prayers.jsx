


export default function Prayers({ prayerData, loading, error }) {
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!prayerData || !prayerData.timings) return null;

    const timings = prayerData.timings;
    
  return (
    <>
    <div className="prayer">
      <ul>
        {Object.entries(timings).map(([name, time]) => {
          if (['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].includes(name)) {
          return (
          <li key={name}>
           <h4 className="prayer-name">{name}</h4>
           <h4 className="prayer-time">{time}</h4>
          </li>
        );
      }
      return null;
    })}
              </ul>

    </div>
    <div className="other-prayers">
      <h3>Jumua: {timings.Dhuhr}</h3>
      <h3>Chourouk : {timings.Sunrise}</h3>
    </div>
    </>
  );
}
