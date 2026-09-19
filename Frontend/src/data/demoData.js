export const alerts = [
  { id: 'TXN-10482', account: 'ACC-20491', amount: '$2,450', risk: 'HIGH', reason: 'New device + unusual location + high amount', time: '2 min ago' },
  { id: 'TXN-10481', account: 'ACC-18732', amount: '$890', risk: 'MEDIUM', reason: 'Unusual transaction time', time: '5 min ago' },
  { id: 'TXN-10480', account: 'ACC-29104', amount: '$125', risk: 'LOW', reason: 'Normal transaction pattern', time: '8 min ago' },
  { id: 'TXN-10479', account: 'ACC-33217', amount: '$3,920', risk: 'HIGH', reason: 'New device + rapid transactions', time: '11 min ago' },
]

export const stats = [
  { label: 'Transactions monitored', value: '12,842', note: 'Today', tone: 'blue', icon: '↗' },
  { label: 'High risk alerts', value: '47', note: 'Requires attention', tone: 'danger', icon: '!' },
  { label: 'Medium risk', value: '126', note: 'Under monitoring', tone: 'warning', icon: '•' },
  { label: 'Active campaigns', value: '8', note: 'Coordinated groups detected', tone: 'purple', icon: '◎' },
]

export const navigation = [
  { id: 'command-center', label: 'Command Center', icon: '⌂' },
  { id: 'live-alerts', label: 'Live Alerts', icon: '!' },
  { id: 'campaigns', label: 'Campaigns', icon: '◎' },
  { id: 'investigation', label: 'Investigation', icon: '⌕' },
  { id: 'review-queue', label: 'Review Queue', icon: '✓' },
  { id: 'analytics', label: 'Analytics', icon: '▥' },
]
