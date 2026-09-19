import './App.css'

function App() {
  const alerts = [
    {
      id: 'TXN-10482',
      account: 'ACC-20491',
      amount: '$2,450',
      risk: 'HIGH',
      reason: 'New device • Unusual location • High amount',
      time: '2 min ago',
    },
    {
      id: 'TXN-10481',
      account: 'ACC-18732',
      amount: '$890',
      risk: 'MEDIUM',
      reason: 'Unusual transaction time',
      time: '5 min ago',
    },
    {
      id: 'TXN-10480',
      account: 'ACC-29104',
      amount: '$125',
      risk: 'LOW',
      reason: 'Normal transaction pattern',
      time: '8 min ago',
    },
    {
      id: 'TXN-10479',
      account: 'ACC-33217',
      amount: '$3,920',
      risk: 'HIGH',
      reason: 'New device • Rapid transactions',
      time: '11 min ago',
    },
  ]

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">F</div>
          <div>
            <h1>Fraudshield</h1>
            <span>TrustGraph</span>
          </div>
        </div>

        <nav className="nav">
          <a className="nav-item active" href="#dashboard">
            <span>⌂</span>
            Dashboard
          </a>

          <a className="nav-item" href="#alerts">
            <span>⚠</span>
            Alerts
          </a>

          <a className="nav-item" href="#campaigns">
            <span>◎</span>
            Campaigns
          </a>

          <a className="nav-item" href="#investigations">
            <span>⌕</span>
            Investigations
          </a>

          <a className="nav-item" href="#review">
            <span>✓</span>
            Review Queue
          </a>
        </nav>

        <div className="sidebar-bottom">
          <div className="system-status">
            <span className="status-dot"></span>
            System operational
          </div>
          <div className="user-box">
            <div className="avatar">A</div>
            <div>
              <strong>Analyst</strong>
              <small>Fraud Operations</small>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">REAL-TIME MONITORING</p>
            <h2>Fraud Intelligence Dashboard</h2>
            <p className="subtitle">
              Monitor suspicious transactions and coordinated fraud campaigns.
            </p>
          </div>

          <div className="live-indicator">
            <span className="status-dot"></span>
            Live monitoring
          </div>
        </header>

        {/* Summary Cards */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <span>Transactions monitored</span>
              <span className="stat-icon">↗</span>
            </div>
            <strong>12,842</strong>
            <small>Today</small>
          </div>

          <div className="stat-card danger">
            <div className="stat-header">
              <span>High risk alerts</span>
              <span className="stat-icon">!</span>
            </div>
            <strong>47</strong>
            <small>Requires attention</small>
          </div>

          <div className="stat-card warning">
            <div className="stat-header">
              <span>Medium risk</span>
              <span className="stat-icon">•</span>
            </div>
            <strong>126</strong>
            <small>Under monitoring</small>
          </div>

          <div className="stat-card purple">
            <div className="stat-header">
              <span>Active campaigns</span>
              <span className="stat-icon">◎</span>
            </div>
            <strong>8</strong>
            <small>Coordinated groups detected</small>
          </div>
        </section>

        {/* Dashboard Grid */}
        <section className="dashboard-grid">
          {/* Risk Overview */}
          <div className="panel risk-panel">
            <div className="panel-heading">
              <div>
                <h3>Risk overview</h3>
                <p>Transaction risk distribution</p>
              </div>
              <span className="panel-label">Today</span>
            </div>

            <div className="risk-content">
              <div className="risk-circle">
                <div>
                  <strong>12,842</strong>
                  <span>transactions</span>
                </div>
              </div>

              <div className="risk-legend">
                <div>
                  <span className="legend-dot low"></span>
                  <span>Low</span>
                  <strong>11,960</strong>
                </div>
                <div>
                  <span className="legend-dot medium"></span>
                  <span>Medium</span>
                  <strong>835</strong>
                </div>
                <div>
                  <span className="legend-dot high"></span>
                  <span>High</span>
                  <strong>47</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Campaign Overview */}
          <div className="panel campaign-panel" id="campaigns">
            <div className="panel-heading">
              <div>
                <h3>Campaign discovery</h3>
                <p>Coordinated fraud activity</p>
              </div>
              <button className="view-button">View graph →</button>
            </div>

            <div className="campaign-visual">
              <div className="network">
                <span className="node node-1"></span>
                <span className="node node-2"></span>
                <span className="node node-3"></span>
                <span className="node node-4"></span>
                <span className="node node-5"></span>
                <span className="node node-6"></span>

                <span className="line line-1"></span>
                <span className="line line-2"></span>
                <span className="line line-3"></span>
                <span className="line line-4"></span>
                <span className="line line-5"></span>
              </div>

              <div className="campaign-info">
                <strong>Campaign #C-008</strong>
                <span>7 connected accounts</span>
                <small>Shared device + recipient pattern</small>
              </div>
            </div>
          </div>
        </section>

        {/* Alerts */}
        <section className="panel alerts-panel" id="alerts">
          <div className="panel-heading">
            <div>
              <h3>Recent alerts</h3>
              <p>Latest transactions requiring monitoring</p>
            </div>

            <button className="view-button">View all alerts →</button>
          </div>

          <div className="table">
            <div className="table-header">
              <span>Transaction</span>
              <span>Account</span>
              <span>Amount</span>
              <span>Risk</span>
              <span>Reason</span>
              <span>Time</span>
            </div>

            {alerts.map((alert) => (
              <div className="table-row" key={alert.id}>
                <strong>{alert.id}</strong>
                <span>{alert.account}</span>
                <span>{alert.amount}</span>

                <span>
                  <span className={`risk-badge ${alert.risk.toLowerCase()}`}>
                    {alert.risk}
                  </span>
                </span>

                <span className="reason">{alert.reason}</span>
                <span className="time">{alert.time}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Fraud DNA */}
        <section className="bottom-grid">
          <div className="panel fraud-dna">
            <div className="panel-heading">
              <div>
                <h3>Fraud DNA</h3>
                <p>Current campaign fingerprint</p>
              </div>
              <span className="campaign-id">C-008</span>
            </div>

            <div className="dna-bars">
              <div>
                <span>Shared device</span>
                <div className="bar">
                  <i style={{ width: '92%' }}></i>
                </div>
                <strong>92%</strong>
              </div>

              <div>
                <span>Common recipient</span>
                <div className="bar">
                  <i style={{ width: '78%' }}></i>
                </div>
                <strong>78%</strong>
              </div>

              <div>
                <span>Rapid transfers</span>
                <div className="bar">
                  <i style={{ width: '67%' }}></i>
                </div>
                <strong>67%</strong>
              </div>

              <div>
                <span>Location overlap</span>
                <div className="bar">
                  <i style={{ width: '54%' }}></i>
                </div>
                <strong>54%</strong>
              </div>
            </div>
          </div>

          <div className="panel review-panel" id="review">
            <div className="panel-heading">
              <div>
                <h3>Review queue</h3>
                <p>Human decisions pending</p>
              </div>
              <span className="queue-count">12</span>
            </div>

            <div className="review-item">
              <div>
                <strong>TXN-10482</strong>
                <span>High risk transaction</span>
              </div>
              <button>Review</button>
            </div>

            <div className="review-item">
              <div>
                <strong>TXN-10479</strong>
                <span>Possible campaign activity</span>
              </div>
              <button>Review</button>
            </div>

            <div className="review-item">
              <div>
                <strong>TXN-10471</strong>
                <span>Unusual device activity</span>
              </div>
              <button>Review</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App