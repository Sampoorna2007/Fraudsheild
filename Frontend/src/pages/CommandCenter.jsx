import StatCard from '../components/StatCard'
import AlertFeed from '../components/AlertFeed'

export default function CommandCenter({ stats, alerts, onAlertSelect }) {
  return <>
    <section className="stats-grid">{stats.map((stat) => <StatCard key={stat.label} {...stat} />)}</section>
    <section className="dashboard-grid">
      <div className="panel"><div className="panel-heading"><div><h3>Risk overview</h3><p>Transaction risk distribution</p></div><span className="panel-label">Today</span></div><div className="risk-content"><div className="risk-circle"><div><strong>12,842</strong><span>transactions</span></div></div><div className="risk-legend"><div><i className="legend-dot low" /><span>Low</span><strong>11,960</strong></div><div><i className="legend-dot medium" /><span>Medium</span><strong>835</strong></div><div><i className="legend-dot high" /><span>High</span><strong>47</strong></div></div></div></div>
      <CampaignPreview />
    </section>
    <section className="panel alerts-panel"><div className="panel-heading"><div><h3>Recent alerts</h3><p>Latest transactions requiring monitoring</p></div><button className="view-button" onClick={() => alerts[0] && onAlertSelect(alerts[0])}>Inspect latest alert</button></div><div onClick={(event) => { const row = event.target.closest('.table-row'); const alert = alerts.find((item) => item.id === row?.dataset.id); if (alert) onAlertSelect(alert) }}><AlertFeed alerts={alerts} /></div></section>
    <section className="bottom-grid"><FraudDNA /><ReviewPreview /></section>
  </>
}

function CampaignPreview() { return <div className="panel"><div className="panel-heading"><div><h3>Campaign discovery</h3><p>Coordinated fraud activity</p></div><button className="view-button">View graph</button></div><div className="campaign-visual"><div className="network">{[1, 2, 3, 4, 5, 6].map((node) => <span className={`node node-${node}`} key={node} />)}{[1, 2, 3, 4, 5].map((line) => <span className={`line line-${line}`} key={line} />)}</div><div className="campaign-info"><strong>Campaign #C-008</strong><span>7 connected accounts</span><small>Shared device + recipient pattern</small></div></div></div> }
function FraudDNA() { return <div className="panel fraud-dna"><div className="panel-heading"><div><h3>Fraud DNA</h3><p>Current campaign fingerprint</p></div><span className="campaign-id">C-008</span></div><div className="dna-bars">{[['Shared device', '92%'], ['Common recipient', '78%'], ['Rapid transfers', '67%'], ['Location overlap', '54%']].map(([label, value]) => <div key={label}><span>{label}</span><div className="bar"><i style={{ width: value }} /></div><strong>{value}</strong></div>)}</div></div> }
function ReviewPreview() { return <div className="panel review-panel"><div className="panel-heading"><div><h3>Review queue</h3><p>Human decisions pending</p></div><span className="queue-count">12</span></div>{[['TXN-10482', 'High risk transaction'], ['TXN-10479', 'Possible campaign activity'], ['TXN-10471', 'Unusual device activity']].map(([id, reason]) => <div className="review-item" key={id}><div><strong>{id}</strong><span>{reason}</span></div><button>Review</button></div>)}</div> }
