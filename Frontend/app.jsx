import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import { io } from 'socket.io-client'
import './App.css'

function App() {
  const [dashboard, setDashboard] = useState({
    totalTransactions: 0,
    highRiskTransactions: 0,
    mediumRiskTransactions: 0,
    totalCampaigns: 0,
  })

  const [transactions, setTransactions] = useState([])
  const [campaigns, setCampaigns] = useState([])

  // Dashboard data
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/dashboard')
      .then((response) => {
        setDashboard(response.data)
      })
      .catch((error) => {
        console.error('Dashboard API error:', error)
      })
  }, [])

  // Transactions data
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/transactions')
      .then((response) => {
        setTransactions(response.data.transactions || [])
      })
      .catch((error) => {
        console.error('Transactions API error:', error)
      })
  }, [])

  // Campaigns data
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/campaigns')
      .then((response) => {
        setCampaigns(response.data.campaigns || [])
      })
      .catch((error) => {
        console.error('Campaigns API error:', error)
      })
  }, [])

  useEffect(() => {
  const socket = io('http://localhost:5000')
   socket.on('connect', () => {
    console.log('Socket connected:', socket.id)
  })

  socket.on('transaction:new', (transaction) => {
    console.log('Live transaction received:', transaction)

    setTransactions((previousTransactions) => {
      const exists = previousTransactions.some(
        (item) => item.transactionId === transaction.transactionId
      )

      if (exists) {
        return previousTransactions
      }

      return [transaction, ...previousTransactions]
    })
  })

  socket.on('alert:new', (alert) => {
    console.log('Live alert received:', alert)
  })

  socket.on('campaign:new', (campaign) => {
    console.log('Live campaign received:', campaign)

    setCampaigns((previousCampaigns) => {
      const exists = previousCampaigns.some(
        (item) => item.campaignId === campaign.campaignId
      )

      if (exists) {
        return previousCampaigns
      }

      return [campaign, ...previousCampaigns]
    })
  })

  socket.on('campaign:updated', (campaign) => {
    console.log('Live campaign updated:', campaign)

    setCampaigns((previousCampaigns) =>
      previousCampaigns.map((item) =>
        item.campaignId === campaign.campaignId ? campaign : item
      )
    )
  })

  return () => {
    socket.disconnect()
  }
}, [])

  const updateCampaignStatus = (campaignId, status) => {
  axios
    .patch(`http://localhost:5000/api/campaigns/${campaignId}/status`, {
      status: status,
    })
    .then(() => {
      return Promise.all([
        axios.get('http://localhost:5000/api/campaigns'),
        axios.get('http://localhost:5000/api/dashboard'),
      ])
    })
    .then(([campaignResponse, dashboardResponse]) => {
      setCampaigns(campaignResponse.data.campaigns || [])
      setDashboard(dashboardResponse.data)
    })
    .catch((error) => {
      console.error('Campaign status update error:', error)
    })
}

  const currentCampaign = campaigns.length > 0 ? campaigns[0] : null
  const currentDNA = currentCampaign?.fraudDNA || {}

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

            <strong>{dashboard.totalTransactions}</strong>
            <small>Today</small>
          </div>

          <div className="stat-card danger">
            <div className="stat-header">
              <span>High risk alerts</span>
              <span className="stat-icon">!</span>
            </div>

            <strong>{dashboard.highRiskTransactions}</strong>
            <small>Requires attention</small>
          </div>

          <div className="stat-card warning">
            <div className="stat-header">
              <span>Medium risk</span>
              <span className="stat-icon">•</span>
            </div>

            <strong>{dashboard.mediumRiskTransactions}</strong>
            <small>Under monitoring</small>
          </div>

          <div className="stat-card purple">
            <div className="stat-header">
              <span>Active campaigns</span>
              <span className="stat-icon">◎</span>
            </div>

            <strong>{dashboard.totalCampaigns}</strong>
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
                  <strong>{dashboard.totalTransactions}</strong>
                  <span>transactions</span>
                </div>
              </div>

              <div className="risk-legend">

                <div>
                  <span className="legend-dot low"></span>
                  <span>Low</span>
                  <strong>
  {dashboard.totalTransactions -
    dashboard.highRiskTransactions -
    dashboard.mediumRiskTransactions}
</strong>
                </div>

                <div>
                  <span className="legend-dot medium"></span>
                  <span>Medium</span>
                  <strong>{dashboard.mediumRiskTransactions}</strong>
                </div>

                <div>
                  <span className="legend-dot high"></span>
                  <span>High</span>
                  <strong>{dashboard.highRiskTransactions}</strong>
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

              <button
  className="view-button"
  onClick={() => {
    document.getElementById('campaign-graph').scrollIntoView({
      behavior: 'smooth'
    })
  }}
>
  View graph →
</button>
            </div>

            <div className="campaign-visual" id="campaign-graph">

              <div className="network">
                {currentCampaign?.accountIds?.map((accountId, index) => (
  <span
    key={accountId}
    className={`node node-${index + 1}`}
    title={accountId}
  >
    {accountId}
  </span>
))}

                <span className="line line-1"></span>
                <span className="line line-2"></span>
                <span className="line line-3"></span>
                <span className="line line-4"></span>
                <span className="line line-5"></span>
              </div>

              <div className="campaign-info">

                <strong>
                  {currentCampaign
                    ? 'Campaign #' + currentCampaign.campaignId
                    : 'No campaigns detected'}
                </strong>

                <span>
                  {currentCampaign
                    ? (currentCampaign.accountIds?.length || 0) +
                      ' connected accounts'
                    : 'No connected accounts'}
                </span>

                <small>
                  {currentCampaign
                    ? 'Shared device + recipient pattern'
                    : 'No suspicious campaign pattern'}
                </small>

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

            <button className="view-button">
              View all alerts →
            </button>
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

            {transactions
  .filter(
    (item) =>
      item.riskLevel === 'MEDIUM' ||
      item.riskLevel === 'HIGH'
  )
  .map((item) => (
              <div
                className="table-row"
                key={item.transactionId}
              >

                <strong>{item.transactionId}</strong>

                <span>{item.accountId}</span>

                <span>
                  {'$' + item.amount}
                </span>

                <span>
                  <span
                    className={
                      'risk-badge ' +
                      (item.riskLevel || 'LOW').toLowerCase()
                    }
                  >
                    {item.riskLevel || 'LOW'}
                  </span>
                </span>

                <span className="reason">
                  {item.riskReasons?.join(' • ') ||
                    'No suspicious activity'}
                </span>

                <span className="time">
                  {item.timestamp
                    ? new Date(item.timestamp).toLocaleTimeString()
                    : '—'}
                </span>

              </div>
            ))}

            {transactions.length === 0 && (
              <div className="table-row">
                <span>No transactions available</span>
              </div>
            )}

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

              <span className="campaign-id">
                {currentCampaign
                  ? currentCampaign.campaignId
                  : '—'}
              </span>
            </div>

            <div className="dna-bars">

              <div>
                <span>Shared device</span>

                <div className="bar">
                  <i
                    style={{
                      width:
                        currentDNA.sharedDevice === 1
                          ? '100%'
                          : '0%',
                    }}
                  ></i>
                </div>

                <strong>
                  {currentDNA.sharedDevice === 1
                    ? 'Detected'
                    : 'Not detected'}
                </strong>
              </div>

              <div>
                <span>Common recipient</span>

                <div className="bar">
                  <i
                    style={{
                      width:
                        currentDNA.sharedRecipient === 1
                          ? '100%'
                          : '0%',
                    }}
                  ></i>
                </div>

                <strong>
                  {currentDNA.sharedRecipient === 1
                    ? 'Detected'
                    : 'Not detected'}
                </strong>
              </div>

              <div>
                <span>Coordinated timing</span>

                <div className="bar">
                  <i
                    style={{
                      width:
                        currentDNA.timingSync === 1 ||
                        currentDNA.timingPattern === 1
                          ? '100%'
                          : '0%',
                    }}
                  ></i>
                </div>

                <strong>
                  {currentDNA.timingSync === 1 ||
                  currentDNA.timingPattern === 1
                    ? 'Detected'
                    : 'Not detected'}
                </strong>
              </div>

              <div>
                <span>Campaign velocity</span>

                <div className="bar">
                  <i
                    style={{
                      width:
                        currentDNA.velocity
                          ? '100%'
                          : '0%',
                    }}
                  ></i>
                </div>

                <strong>
                  {currentDNA.velocity
                    ? currentDNA.velocity + ' transactions'
                    : 'Not available'}
                </strong>
              </div>

            </div>
          </div>

          {/* Review Queue */}
          <div className="panel review-panel" id="review">

            <div className="panel-heading">
              <div>
                <h3>Review queue</h3>
                <p>Human decisions pending</p>
              </div>

              <span className="queue-count">
                {
                  campaigns.filter(
                    (campaign) => campaign.status === 'WATCH'
                  ).length
                }
              </span>
            </div>

            {campaigns
              .filter(
                (campaign) => campaign.status === 'WATCH'
              )
              .map((campaign) => (
                <div
                  className="review-item"
                  key={campaign.campaignId}
                >

                  <div>
                    <strong>{campaign.campaignId}</strong>

                    <span>
                      {campaign.accountIds?.length || 0}
                      {' '}
                      connected accounts
                    </span>
                  </div>

                  <div>
  <button
    onClick={() => updateCampaignStatus(campaign.campaignId, 'CONFIRMED')}
  >
    Confirm
  </button>

  <button
    onClick={() => updateCampaignStatus(campaign.campaignId, 'DISMISSED')}
  >
    Dismiss
  </button>
</div>

                </div>
              ))}

            {campaigns.filter(
              (campaign) => campaign.status === 'WATCH'
            ).length === 0 && (
              <div className="review-item">

                <div>
                  <strong>No pending reviews</strong>

                  <span>
                    All campaigns have been reviewed
                  </span>
                </div>

              </div>
            )}

          </div>

        </section>

      </main>
    </div>
  )
}

export default App

createRoot(
  document.getElementById('root')
).render(<App />)