export function subscribeToAlerts(onAlert) {
  const timer = window.setInterval(() => onAlert?.(), 30000)
  return () => window.clearInterval(timer)
}
