import { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import AlertDrawer from './components/AlertDrawer'
import { alerts, navigation, stats } from './data/demoData'
import { subscribeToAlerts } from './services/socket'
import CommandCenter from './pages/CommandCenter'
import LiveAlerts from './pages/LiveAlerts'
import Campaigns from './pages/Campaigns'
import Investigation from './pages/Investigation'
import ReviewQueue from './pages/ReviewQueue'
import Analytics from './pages/Analytics'
import './index.css'

const pageMap = { 'command-center': [CommandCenter, 'Fraud Intelligence Dashboard', 'Monitor suspicious transactions and coordinated fraud campaigns.'], 'live-alerts': [LiveAlerts, 'Live alert stream', 'Prioritize suspicious activity as it arrives.'], campaigns: [Campaigns, 'Campaign intelligence', 'See how suspicious entities connect across the network.'], investigation: [Investigation, 'Investigation workspace', 'Trace signals, accounts, and devices from one place.'], 'review-queue': [ReviewQueue, 'Review queue', 'Resolve the decisions that need a human eye.'], analytics: [Analytics, 'Detection analytics', 'Measure coverage, response time, and prevented loss.'] }

export default function App() {
  const [activePage, setActivePage] = useState('command-center')
  const [selectedAlert, setSelectedAlert] = useState(null)
  const [, setStreamTick] = useState(0)
  useEffect(() => subscribeToAlerts(() => setStreamTick((tick) => tick + 1)), [])
  const [Page, title, description] = pageMap[activePage] || pageMap['command-center']
  const pageProps = activePage === 'command-center' ? { stats, alerts, onAlertSelect: setSelectedAlert } : activePage === 'live-alerts' ? { alerts, onAlertSelect: setSelectedAlert } : {}
  return <div className="app"><Sidebar activePage={activePage} onNavigate={setActivePage} /><main className="main"><Header title={title} description={description} /><Page {...pageProps} /></main><AlertDrawer alert={selectedAlert} onClose={() => setSelectedAlert(null)} /><footer className="mobile-nav">{navigation.map((item) => <button key={item.id} className={activePage === item.id ? 'active' : ''} onClick={() => setActivePage(item.id)}>{item.icon}<span>{item.label}</span></button>)}</footer></div>
}
