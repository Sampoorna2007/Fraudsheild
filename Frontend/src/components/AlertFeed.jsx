import RiskBadge from './RiskBadge'

export default function AlertFeed({ alerts }) {
  return <div className="table"><div className="table-header"><span>Transaction</span><span>Account</span><span>Amount</span><span>Risk</span><span>Reason</span><span>Time</span></div>{alerts.map((alert) => <div className="table-row" data-id={alert.id} key={alert.id}><strong>{alert.id}</strong><span>{alert.account}</span><span>{alert.amount}</span><span><RiskBadge level={alert.risk} /></span><span className="reason">{alert.reason}</span><span className="time">{alert.time}</span></div>)}</div>
}
