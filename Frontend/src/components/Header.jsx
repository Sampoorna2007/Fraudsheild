export default function Header({ title, description }) {
  return <header className="topbar"><div><p className="eyebrow">REAL-TIME MONITORING</p><h2>{title}</h2><p className="subtitle">{description}</p></div><div className="live-indicator"><span className="status-dot" />Live monitoring</div></header>
}
