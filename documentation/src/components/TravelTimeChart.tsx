import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface TravelTimeChartProps {
  style?: React.CSSProperties;
}

const data = [
  {
    destination: 'Mars',
    'Chemical Rocket': 0.6,
    'Nuclear Thermal': 0.3,
    'Nuclear Electric': 0.8,
    'Starshot (20% c)': 21.0,
    'Warp Drive (1c)': 0.00002,
  },
  {
    destination: 'Proxima Centauri',
    'Chemical Rocket': 6500,
    'Nuclear Thermal': 4500,
    'Nuclear Electric': 6500,
    'Starshot (20% c)': 21.0,
    'Warp Drive (1c)': 4.24,
  },
  {
    destination: 'TRAPPIST-1 (40 ly)',
    'Chemical Rocket': 61000,
    'Nuclear Thermal': 42000,
    'Nuclear Electric': 61000,
    'Starshot (20% c)': 200,
    'Warp Drive (1c)': 40,
  },
];

export default function TravelTimeChart({ style }: TravelTimeChartProps): React.Element {
  return (
    <div style={style}>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="destination"
            stroke="#666"
            style={{ fontSize: '14px' }}
          />
          <YAxis
            stroke="#666"
            style={{ fontSize: '12px' }}
            label={{ value: 'Time (years)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '12px'
            }}
            formatter={(value: number) => {
              if (value < 0.001) return [`${(value * 365 * 24).toFixed(1)} hours`, ''];
              if (value < 1) return [`${(value * 365).toFixed(1)} days`, ''];
              return [`${value.toLocaleString()} years`, ''];
            }}
          />
          <Legend wrapperStyle={{ fontSize: '13px' }} />
          <Bar dataKey="Chemical Rocket" fill="#ef4444" name="Chemical Rocket" />
          <Bar dataKey="Nuclear Thermal" fill="#f59e0b" name="Nuclear Thermal" />
          <Bar dataKey="Nuclear Electric" fill="#10b981" name="Nuclear Electric" />
          <Bar dataKey="Starshot (20% c)" fill="#3b82f6" name="Starshot (20% c)" />
          <Bar dataKey="Warp Drive (1c)" fill="#8b5cf6" name="Warp Drive (1c)" />
        </BarChart>
      </ResponsiveContainer>
      <p style={{textAlign: 'center', fontSize: '13px', color: '#666', marginTop: '10px'}}>
        <strong>Sources:</strong> NASA nuclear propulsion programs, Breakthrough Starshot estimates,
        and current mission data. Chemical rockets: 6-9 months to Mars. Nuclear thermal:
        3-4 months to Mars. Nuclear electric: ~10 months to Mars.
        Interstellar times use realistic velocity estimates.
      </p>
    </div>
  );
}
