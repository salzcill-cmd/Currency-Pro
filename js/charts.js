// ===== Currency Pro - Charts JavaScript =====
// Chart initialization and analytics logic

// Initialize when Alpine is ready
document.addEventListener('alpine:init', () => {
  // Charts module is initialized in charts.html
});

// Chart.js default configuration
Chart.defaults.font.family = "'DM Mono', monospace";
Chart.defaults.color = getComputedStyle(document.documentElement).getPropertyValue('--tw-text-opacity') ? '#94a3b8' : '#64748b';
Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(0, 0, 0, 0.8)';
Chart.defaults.plugins.tooltip.titleFont = { size: 14, weight: 'bold' };
Chart.defaults.plugins.tooltip.bodyFont = { size: 12 };
Chart.defaults.plugins.legend.labels.usePointStyle = true;

// Generate historical data (mock for 30 days)
function generateHistoricalData(baseRate, days = 30) {
  const data = [];
  let rate = baseRate;
  for (let i = 0; i < days; i++) {
    rate += (Math.random() - 0.5) * 0.02;
    data.push(parseFloat(rate.toFixed(4)));
  }
  return data;
}

// Generate date labels
function generateDateLabels(days = 30) {
  const labels = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  }
  return labels;
}

// Calculate SMA (Simple Moving Average)
function calculateSMA(data, period = 7) {
  const sma = [];
  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);
    const avg = slice.reduce((sum, val) => sum + val, 0) / period;
    sma.push(parseFloat(avg.toFixed(4)));
  }
  return sma;
}

// Calculate volatility
function calculateVolatility(data) {
  const returns = [];
  for (let i = 1; i < data.length; i++) {
    returns.push((data[i] - data[i - 1]) / data[i - 1]);
  }
  const mean = returns.reduce((sum, val) => sum + val, 0) / returns.length;
  const variance = returns.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / returns.length;
  return (Math.sqrt(variance) * 100).toFixed(2);
}

// Calculate support and resistance levels
function calculateSupportResistance(data) {
  const sorted = [...data].sort((a, b) => a - b);
  const q1Index = Math.floor(sorted.length * 0.25);
  const q3Index = Math.floor(sorted.length * 0.75);
  return {
    support: sorted[q1Index].toFixed(4),
    resistance: sorted[q3Index].toFixed(4)
  };
}

// Create gradient for chart
function createGradient(ctx, color1, color2) {
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  return gradient;
}

// Export for use in charts.html
window.CurrencyCharts = {
  generateHistoricalData,
  generateDateLabels,
  calculateSMA,
  calculateVolatility,
  calculateSupportResistance,
  createGradient
};
