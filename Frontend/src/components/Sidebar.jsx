import { navigation } from '../data/demoData'

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="brand"><div className="brand-icon">F</div><div><h1>Fraudshield</h1><span>TrustGraph</span></div></div>
      <nav className="nav" aria-label="Primary navigation">
        {navigation.map((item) => <button className={`nav-item ${activePage === item.id ? 'active' : ''}`} key={item.id} onClick={() => onNavigate(item.id)}><span>{item.icon}</span>{item.label}</button>)}
      </nav>
      <div className="sidebar-bottom">
        <div className="system-status"><span className="status-dot" />System operational</div>
        <div className="user-box"><div className="avatar">A</div><div><strong>Analyst</strong><small>Fraud Operations</small></div></div>
      </div>
    </aside>
  )
}
