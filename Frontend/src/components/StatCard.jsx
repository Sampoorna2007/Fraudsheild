export default function StatCard({ label, value, note, tone, icon }) {
  return (
    <article className={`stat-card ${tone}`}>
      <div className="stat-header"><span>{label}</span><span className="stat-icon">{icon}</span></div>
      <strong>{value}</strong>
      <small>{note}</small>
    </article>
  )
}
