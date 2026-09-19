import { alerts, stats } from '../data/demoData'

export async function getDashboardData() {
  return { alerts, stats }
}

export async function getAlerts() {
  return alerts
}
