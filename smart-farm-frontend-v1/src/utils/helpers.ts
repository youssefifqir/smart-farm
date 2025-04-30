// Format date to display in a user-friendly format
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Format a number to include unit
export const formatWithUnit = (value: number, unit: string): string => {
  return `${value}${unit}`;
};

// Calculate time difference from now in human-readable format
export const timeAgo = (timestamp: string): string => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now.getTime() - past.getTime();
  
  // Convert to seconds
  const diffSec = Math.floor(diffMs / 1000);
  
  if (diffSec < 60) {
    return `${diffSec} sec ago`;
  }
  
  // Convert to minutes
  const diffMin = Math.floor(diffSec / 60);
  
  if (diffMin < 60) {
    return `${diffMin} min ago`;
  }
  
  // Convert to hours
  const diffHour = Math.floor(diffMin / 60);
  
  if (diffHour < 24) {
    return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  }
  
  // Convert to days
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffDay < 30) {
    return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  }
  
  // For older dates, return the formatted date
  return formatDate(timestamp);
};

// Get appropriate status color based on value and thresholds
export const getStatusColor = (
  value: number, 
  optimal: { min: number; max: number }, 
  warning: { min: number; max: number }
): string => {
  if (value >= optimal.min && value <= optimal.max) {
    return 'green';
  }
  
  if (
    (value >= warning.min && value < optimal.min) || 
    (value > optimal.max && value <= warning.max)
  ) {
    return 'amber';
  }
  
  return 'red';
};

// Calculate percentage change between two values
export const calculatePercentageChange = (
  current: number, 
  previous: number
): string => {
  if (previous === 0) return '+100%';
  
  const change = ((current - previous) / previous) * 100;
  return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
};

// Format sensor value with appropriate precision
export const formatSensorValue = (value: number, type: string): string => {
  switch (type) {
    case 'temperature':
      return value.toFixed(1) + '°C';
    case 'humidity':
    case 'soil_moisture':
      return value.toFixed(0) + '%';
    case 'rain':
      return value.toFixed(1) + 'mm';
    case 'water_usage':
      return value.toFixed(0) + 'L';
    default:
      return value.toString();
  }
};