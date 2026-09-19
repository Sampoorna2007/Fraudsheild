import RiskBadge from './RiskBadge'

export default function AlertDrawer({ alert, onClose }) {
  if (!alert) return null
  return <div className="drawer-backdrop" onClick={onClose}><aside className="alert-drawer" onClick={(event) => event.stopPropagation()}><button className="drawer-close" onClick={onClose} aria-label="Close alert">×</button><p className="eyebrow">ALERT DETAIL</p><h3>{alert.id}</h3><RiskBadge level={alert.risk} /><dl><div><dt>Account</dt><dd>{alert.account}</dd></div><div><dt>Amount</dt><dd>{alert.amount}</dd></div><div><dt>Signal</dt><dd>{alert.reason}</dd></div><div><dt>Detected</dt><dd>{alert.time}</dd></div></dl><button className="primary-button" onClick={onClose}>Mark for review</button></aside></div>
}
