import React, { useState } from 'react';

export default function SpaceScaleCarousel(): React.Element {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { id: 0, name: 'Propulsion Tech', icon: '🚀', description: 'Technology comparison' },
    { id: 1, name: 'Space Scale', icon: '🌌', description: 'Moon to Universe edge' }
  ];

  return (
    <div style={{ margin: '32px 0' }}>
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 20px',
              border: '1px solid var(--ifm-border-color)',
              borderRadius: '12px',
              background: activeTab === tab.id
                ? 'linear-gradient(135deg, var(--ifm-color-primary) 0%, var(--ifm-color-primary-dark) 100%)'
                : 'var(--ifm-background-color)',
              color: activeTab === tab.id ? 'white' : 'var(--ifm-text-color)',
              fontSize: '15px',
              fontWeight: activeTab === tab.id ? '600' : '400',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: activeTab === tab.id
                ? '0 6px 20px rgba(102, 126, 234, 0.4)'
                : '0 2px 8px rgba(0,0,0,0.05)',
              transform: activeTab === tab.id ? 'translateY(-2px)' : 'translateY(0)',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>{tab.icon}</span>
              <div>
                <div>{tab.name}</div>
                <div style={{
                  fontSize: '11px',
                  opacity: 0.8,
                  fontWeight: '400',
                  color: 'inherit'
                }}>
                  {tab.description}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div style={{
        background: 'var(--ifm-background-color)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        border: '1px solid var(--ifm-table-border-color)'
      }}>
        {activeTab === 0 && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <h3 style={{
              margin: '0 0 20px 0',
              color: 'var(--ifm-color-primary)',
              fontSize: '20px',
              fontWeight: '700',
              paddingBottom: '12px',
              borderBottom: '2px solid var(--ifm-border-color)'
            }}>
              🚀 Propulsion Technology Comparison
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '12px',
                background: 'var(--ifm-background-color)',
                color: 'var(--ifm-text-color)'
              }}>
                <thead>
                  <tr style={{ background: 'rgba(0, 0, 0, 0.05)' }}>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: '700', color: '#000000' }}>Technology</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: '700', color: '#000000' }}>Speed</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: '700', color: '#000000' }}>% of c</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: '700', color: '#000000' }}>Time to Proxima</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: '700', color: '#000000' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--ifm-table-border-color)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: 'var(--ifm-text-color)' }}>Walking (5 km/h)</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: 'var(--ifm-text-color-secondary)' }}>1.4 m/s</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: 'var(--ifm-text-color-secondary)' }}>4.7×10⁻⁹c</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>~290 million years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>🙂 Possible</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--ifm-table-border-color)', background: 'var(--ifm-table-stripe-background)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: 'var(--ifm-text-color)' }}>Voyager 1</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: 'var(--ifm-text-color-secondary)' }}>17 km/s</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: 'var(--ifm-text-color-secondary)' }}>0.000057c</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>~75,000 years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>✅ Real</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--ifm-table-border-color)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: 'var(--ifm-text-color)' }}>Chemical Rocket (max)</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: 'var(--ifm-text-color-secondary)' }}>20 km/s</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: 'var(--ifm-text-color-secondary)' }}>0.000067c</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>~63,000 years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>✅ Modern</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--ifm-table-border-color)', background: 'var(--ifm-table-stripe-background)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: 'var(--ifm-text-color)' }}>Ion Drive (future)</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: 'var(--ifm-text-color-secondary)' }}>300 km/s</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: 'var(--ifm-text-color-secondary)' }}>0.001c</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>~4,240 years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>✅ Real, Slow</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--ifm-table-border-color)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: 'var(--ifm-text-color)' }}>Fusion (Project Daedalus)</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: 'var(--ifm-text-color-secondary)' }}>36,000 km/s</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: 'var(--ifm-text-color-secondary)' }}>0.12c</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>~36 years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>💭 Concept</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--ifm-table-border-color)', background: 'var(--ifm-table-stripe-background)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: 'var(--ifm-text-color)' }}>Speed of Light</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: 'var(--ifm-text-color-secondary)' }}>299,792 km/s</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: 'var(--ifm-text-color-secondary)' }}>1c</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>4.246 years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>⛔ Impossible for Mass</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--ifm-table-border-color)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: 'var(--ifm-text-color)' }}>Warp Drive (0.9c)</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: 'var(--ifm-text-color-secondary)' }}>Warp Bubble</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: 'var(--ifm-text-color-secondary)' }}>0.9c</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>~4.7 years (Earth time)</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>🫧 Hypothetical</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--ifm-table-border-color)', background: 'var(--ifm-table-stripe-background)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: 'var(--ifm-text-color)' }}>Warp Drive (2c)</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: 'var(--ifm-text-color-secondary)' }}>FTL</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: 'var(--ifm-text-color-secondary)' }}>2c</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>~2.1 years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>🫧 Hypothetical</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--ifm-table-border-color)', background: 'var(--ifm-table-stripe-background)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: 'var(--ifm-text-color)' }}>Warp Drive (10c)</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: 'var(--ifm-text-color-secondary)' }}>FTL</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: 'var(--ifm-text-color-secondary)' }}>10c</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>~5 months</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>🫧 Hypothetical</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--ifm-table-border-color)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: 'var(--ifm-text-color)' }}>Warp Drive (100c)</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: 'var(--ifm-text-color-secondary)' }}>FTL</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: 'var(--ifm-text-color-secondary)' }}>100c</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>~15 days</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>🫧 Hypothetical</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--ifm-table-border-color)', background: 'var(--ifm-table-stripe-background)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: 'var(--ifm-text-color)' }}>Warp Drive (1000c)</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: 'var(--ifm-text-color-secondary)' }}>FTL</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: 'var(--ifm-text-color-secondary)' }}>1000c</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>~1.5 days</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>🫧 Hypothetical</td>
                  </tr>
                  <tr style={{ background: 'var(--ifm-table-stripe-background)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: 'var(--ifm-text-color)' }}>Wormhole</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: 'var(--ifm-text-color-secondary)' }}>Effective FTL</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: 'var(--ifm-text-color-secondary)' }}>Instant-Hours</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>Instant-Hours</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>🔬 Pure Theory</td>
                  </tr>
                </tbody>
              </table>
              <div style={{
                marginTop: '16px',
                padding: '12px 16px',
                background: 'var(--ifm-color-info-contrast-background)',
                borderLeft: '4px solid var(--ifm-color-info)',
                borderRadius: '4px',
                fontSize: '12px',
                color: 'var(--ifm-color-info-contrast-foreground)'
              }}>
                📌 <strong>Destination:</strong> Proxima Centauri (4.246 light-years) • *Antimatter Drive assumes 50% efficiency
              </div>
            </div>
          </div>
        )}

        {activeTab === 1 && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <h3 style={{
              margin: '0 0 20px 0',
              color: 'var(--ifm-color-primary)',
              fontSize: '20px',
              fontWeight: '700',
              paddingBottom: '12px',
              borderBottom: '2px solid var(--ifm-border-color)'
            }}>
              🌌 Scale of the Cosmos: Moon to Universe Edge
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '12px',
                background: 'var(--ifm-background-color)',
                color: 'var(--ifm-text-color)'
              }}>
                <thead>
                  <tr style={{ background: 'rgba(0, 0, 0, 0.05)' }}>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: '700', color: '#000000' }}>Destination</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: '700', color: '#000000' }}>Distance</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: '700', color: '#000000' }}>Chemical</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: '700', color: '#000000' }}>300 km/s</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: '700', color: '#000000' }}>0.2c</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: '700', color: '#000000' }}>0.9c</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: '700', color: '#000000' }}>Warp 10c</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: '700', color: '#000000' }}>Warp 100c</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: '700', color: '#000000' }}>Warp 1000c</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--ifm-table-border-color)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: 'var(--ifm-text-color)' }}>Moon</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: '11px' }}>384,400 km</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>~3 days</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>~21 min</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>~6 sec</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>~1.4 sec</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-primary)', fontWeight: '600' }}>instant</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-primary)', fontWeight: '600' }}>instant</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-primary)', fontWeight: '600' }}>instant</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--ifm-table-border-color)', background: 'var(--ifm-table-stripe-background)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: 'var(--ifm-text-color)' }}>Mars</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: '11px' }}>55–400M km</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>7–9 months</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>~2 days</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>~13 min</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>~3 min</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-primary)', fontWeight: '600' }}>instant</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-primary)', fontWeight: '600' }}>instant</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-primary)', fontWeight: '600' }}>instant</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--ifm-table-border-color)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: 'var(--ifm-text-color)' }}>Jupiter</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: '11px' }}>~778M km</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>~6 years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>~30 days</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>~36 min</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>~8 min</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-primary)', fontWeight: '600' }}>instant</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-primary)', fontWeight: '600' }}>instant</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-primary)', fontWeight: '600' }}>instant</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--ifm-table-border-color)', background: 'var(--ifm-table-stripe-background)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: 'var(--ifm-text-color)' }}>Pluto</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: '11px' }}>~5.9B km</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>~30–50 years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>~228 days</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>~5.5 hours</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>~1.2 hours</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-primary)', fontWeight: '600' }}>~4 min</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-primary)', fontWeight: '600' }}>~24 sec</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-primary)', fontWeight: '600' }}>~2.4 sec</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--ifm-table-border-color)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: 'var(--ifm-text-color)' }}>Oort Cloud</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: '11px' }}>~1 ly</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-danger)' }}>~18,000 years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-warning-dark)', fontWeight: '500' }}>~1,000 years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>~5 years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>~1.1 years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-primary)', fontWeight: '600' }}>~36 days</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-primary)', fontWeight: '600' }}>~3.6 days</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-primary)', fontWeight: '600' }}>~8.7 hours</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--ifm-table-border-color)', background: 'var(--ifm-table-stripe-background)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: 'var(--ifm-text-color)' }}>Proxima Centauri</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: '11px' }}>4.246 ly</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-danger)' }}>~75,000 years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-warning-dark)', fontWeight: '500' }}>~4,240 years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>~21 years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>~4.7 years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-primary)', fontWeight: '600' }}>~5 months</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-primary)', fontWeight: '600' }}>~15 days</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-primary)', fontWeight: '600' }}>~1.5 days</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--ifm-table-border-color)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: 'var(--ifm-text-color)' }}>Orion Nebula</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: '11px' }}>~1,344 ly</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-danger)' }}>~24M years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-warning-dark)', fontWeight: '500' }}>~1.3M years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>~6,700 years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>~1,500 years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-primary)', fontWeight: '600' }}>~134 years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-primary)', fontWeight: '600' }}>~13 years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-primary)', fontWeight: '600' }}>~1.3 years</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--ifm-table-border-color)', background: 'var(--ifm-table-stripe-background)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: 'var(--ifm-text-color)' }}>Milky Way Center</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: '11px' }}>~26,700 ly</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-danger)' }}>~470M years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-warning-dark)', fontWeight: '500' }}>~27M years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>~133,000 years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>~30,000 years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-primary)', fontWeight: '600' }}>~2,670 years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-primary)', fontWeight: '600' }}>~267 years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-primary)', fontWeight: '600' }}>~27 years</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--ifm-table-border-color)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: 'var(--ifm-text-color)' }}>Edge of Milky Way</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: '11px' }}>~100,000 ly</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-danger)' }}>~1.8B years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-warning-dark)', fontWeight: '500' }}>~100M years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>~500,000 years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>~111,000 years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-primary)', fontWeight: '600' }}>~10,000 years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-primary)', fontWeight: '600' }}>~1,000 years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-primary)', fontWeight: '600' }}>~100 years</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--ifm-table-border-color)', background: 'var(--ifm-table-stripe-background)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: 'var(--ifm-text-color)' }}>Andromeda Galaxy</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: '11px' }}>~2.5M ly</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-danger)' }}>~44B years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-warning-dark)', fontWeight: '500' }}>~2.5B years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>~12.5M years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>~2.8M years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-primary)', fontWeight: '600' }}>~250,000 years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-primary)', fontWeight: '600' }}>~25,000 years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-primary)', fontWeight: '600' }}>~2,500 years</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--ifm-table-border-color)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: 'var(--ifm-text-color)' }}>Virgo Cluster</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: '11px' }}>~54M ly</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-danger)', fontWeight: '600' }}>impossible</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-warning-dark)', fontWeight: '500' }}>~54B years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>~270M years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>~60M years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-primary)', fontWeight: '600' }}>~5.4M years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-primary)', fontWeight: '600' }}>~540,000 years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-primary)', fontWeight: '600' }}>~54,000 years</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--ifm-table-border-color)', background: 'var(--ifm-table-stripe-background)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: 'var(--ifm-text-color)' }}>GN-z11*</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: '11px' }}>~32B ly</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-danger)', fontWeight: '600' }}>impossible</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-danger)', fontWeight: '600' }}>impossible</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>~160B years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>~35B years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-primary)', fontWeight: '600' }}>~3.2B years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-primary)', fontWeight: '600' }}>~320M years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-primary)', fontWeight: '600' }}>~32M years</td>
                  </tr>
                  <tr style={{ background: 'var(--ifm-table-stripe-background)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: 'var(--ifm-text-color)' }}>Observable Universe</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: '11px' }}>~46.5B ly</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-danger)', fontWeight: '600' }}>impossible</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-danger)', fontWeight: '600' }}>impossible</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>~232B years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-text-color)' }}>~52B years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-primary)', fontWeight: '600' }}>~4.65B years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-primary)', fontWeight: '600' }}>~465M years</td>
                    <td style={{ padding: '12px 14px', color: 'var(--ifm-color-primary)', fontWeight: '600' }}>~46.5M years</td>
                  </tr>
                </tbody>
              </table>
              <div style={{
                marginTop: '16px',
                padding: '12px 16px',
                background: 'var(--ifm-color-warning-contrast-background)',
                borderLeft: '4px solid var(--ifm-color-warning)',
                borderRadius: '4px',
                fontSize: '12px',
                color: 'var(--ifm-color-warning-contrast-foreground)'
              }}>
                ⚠️ <strong>Note:</strong> Due to cosmic expansion, the actual current distance is greater than the light travel time for objects marked with *
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        table tbody tr:hover {
          background: var(--ifm-table-stripe-background) !important;
        }

        [data-theme='dark'] table tbody tr:hover {
          background: rgba(255, 255, 255, 0.05) !important;
        }

        [data-theme='dark'] table {
          color: var(--ifm-text-color) !important;
        }

        [data-theme='dark'] td {
          border-color: var(--ifm-table-border-color) !important;
        }

        [data-theme='dark'] thead tr {
          background: rgba(255, 255, 255, 0.15) !important;
        }

        [data-theme='dark'] th {
          color: #ffffff !important;
        }

        [data-theme='dark'] table tbody tr:last-child {
          background: rgba(255, 255, 255, 0.02) !important;
        }

        [data-theme='light'] table tbody tr:last-child {
          background: rgba(0, 0, 0, 0.02) !important;
        }
      `}</style>
    </div>
  );
}