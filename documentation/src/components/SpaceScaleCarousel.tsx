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
              border: 'none',
              borderRadius: '12px',
              background: activeTab === tab.id
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : '#f6f8fa',
              color: activeTab === tab.id ? 'white' : '#586069',
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
                  fontWeight: '400'
                }}>
                  {tab.description}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        border: '1px solid #e1e4e8'
      }}>
        {activeTab === 0 && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <h3 style={{
              margin: '0 0 20px 0',
              color: '#667eea',
              fontSize: '20px',
              fontWeight: '700',
              paddingBottom: '12px',
              borderBottom: '2px solid #f6f8fa'
            }}>
              🚀 Propulsion Technology Comparison
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '12px',
                background: 'white'
              }}>
                <thead>
                  <tr style={{ background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)' }}>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: '700', color: '#667eea' }}>Technology</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: '700', color: '#667eea' }}>Speed</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: '700', color: '#667eea' }}>% of c</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: '700', color: '#667eea' }}>Time to Proxima</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: '700', color: '#667eea' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e1e4e8' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#24292e' }}>Walking (5 km/h)</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>1.4 m/s</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>4.7×10⁻⁹c</td>
                    <td style={{ padding: '12px 14px' }}>~290 million years</td>
                    <td style={{ padding: '12px 14px' }}>🙂 Possible</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e1e4e8', background: '#f6f8fa' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#24292e' }}>Car (100 km/h)</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>27.8 m/s</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>9.3×10⁻⁸c</td>
                    <td style={{ padding: '12px 14px' }}>~45 million years</td>
                    <td style={{ padding: '12px 14px' }}>✅ Real</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e1e4e8' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#24292e' }}>Passenger Airplane</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>900 km/h</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>8.3×10⁻⁷c</td>
                    <td style={{ padding: '12px 14px' }}>~5 million years</td>
                    <td style={{ padding: '12px 14px' }}>✅ Real</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e1e4e8', background: '#f6f8fa' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#24292e' }}>Bullet (1 km/s)</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>1 km/s</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>0.000003c</td>
                    <td style={{ padding: '12px 14px' }}>~1.27 million years</td>
                    <td style={{ padding: '12px 14px' }}>✅ Real</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e1e4e8' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#24292e' }}>Earth Orbital Speed</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>7.9 km/s</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>0.000026c</td>
                    <td style={{ padding: '12px 14px' }}>~161,000 years</td>
                    <td style={{ padding: '12px 14px' }}>✅ Real</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e1e4e8', background: '#f6f8fa' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#24292e' }}>Voyager 1</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>17 km/s</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>0.000057c</td>
                    <td style={{ padding: '12px 14px' }}>~75,000 years</td>
                    <td style={{ padding: '12px 14px' }}>✅ Real</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e1e4e8' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#24292e' }}>New Horizons</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>16.3 km/s</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>0.000054c</td>
                    <td style={{ padding: '12px 14px' }}>~78,000 years</td>
                    <td style={{ padding: '12px 14px' }}>✅ Real</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e1e4e8', background: '#f6f8fa' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#24292e' }}>Chemical Rocket (max)</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>20 km/s</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>0.000067c</td>
                    <td style={{ padding: '12px 14px' }}>~63,000 years</td>
                    <td style={{ padding: '12px 14px' }}>✅ Modern</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e1e4e8' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#24292e' }}>Nuclear Pulse (Project Orion)</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>100–300 km/s</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>~0.001c</td>
                    <td style={{ padding: '12px 14px' }}>~4,000–13,000 years</td>
                    <td style={{ padding: '12px 14px' }}>🔧 Theoretically Possible</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e1e4e8', background: '#f6f8fa' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#24292e' }}>Ion Drive (future)</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>300 km/s</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>0.001c</td>
                    <td style={{ padding: '12px 14px' }}>~4,240 years</td>
                    <td style={{ padding: '12px 14px' }}>✅ Real, Slow</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e1e4e8' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#24292e' }}>Solar Sail</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>500 km/s</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>0.0017c</td>
                    <td style={{ padding: '12px 14px' }}>~2,500 years</td>
                    <td style={{ padding: '12px 14px' }}>🚀 Possible</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e1e4e8', background: '#f6f8fa' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#24292e' }}>Fusion (Project Daedalus)</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>36,000 km/s</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>0.12c</td>
                    <td style={{ padding: '12px 14px' }}>~36 years</td>
                    <td style={{ padding: '12px 14px' }}>💭 Concept</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e1e4e8' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#24292e' }}>Antimatter Drive</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>150,000 km/s</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>0.5c</td>
                    <td style={{ padding: '12px 14px' }}>~8.5 years*</td>
                    <td style={{ padding: '12px 14px' }}>🔮 Theoretical</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e1e4e8', background: '#f6f8fa' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#24292e' }}>Breakthrough Starshot</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>60,000 km/s</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>0.2c</td>
                    <td style={{ padding: '12px 14px' }}>~21 years</td>
                    <td style={{ padding: '12px 14px' }}>🚧 In Development</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e1e4e8' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#24292e' }}>Relativistic Ship</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>270,000 km/s</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>0.9c</td>
                    <td style={{ padding: '12px 14px' }}>~4.7 years (Earth time)</td>
                    <td style={{ padding: '12px 14px' }}>🔮 Theoretical</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e1e4e8', background: '#f6f8fa' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#24292e' }}>Speed of Light</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>299,792 km/s</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>1c</td>
                    <td style={{ padding: '12px 14px' }}>4.246 years</td>
                    <td style={{ padding: '12px 14px' }}>⛔ Impossible for Mass</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e1e4e8' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#24292e' }}>Warp Drive (0.9c)</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>Warp Bubble</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>0.9c</td>
                    <td style={{ padding: '12px 14px' }}>~4.7 years (Earth time)</td>
                    <td style={{ padding: '12px 14px' }}>🫧 Hypothetical</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e1e4e8', background: '#f6f8fa' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#24292e' }}>Warp Drive (5c)</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>FTL</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>5c</td>
                    <td style={{ padding: '12px 14px' }}>~10 months</td>
                    <td style={{ padding: '12px 14px' }}>🫧 Hypothetical</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e1e4e8' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#24292e' }}>Warp Drive (10c)</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>FTL</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>10c</td>
                    <td style={{ padding: '12px 14px' }}>~5 months</td>
                    <td style={{ padding: '12px 14px' }}>🫧 Hypothetical</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e1e4e8', background: '#f6f8fa' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#24292e' }}>Warp Drive (100c)</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>FTL</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>100c</td>
                    <td style={{ padding: '12px 14px' }}>~15 days</td>
                    <td style={{ padding: '12px 14px' }}>🫧 Hypothetical</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e1e4e8' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#24292e' }}>Warp Drive (1000c)</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>FTL</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>1000c</td>
                    <td style={{ padding: '12px 14px' }}>~1.5 days</td>
                    <td style={{ padding: '12px 14px' }}>🫧 Hypothetical</td>
                  </tr>
                  <tr style={{ background: '#f6f8fa' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#24292e' }}>Wormhole</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>Effective FTL</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>Instant-Hours</td>
                    <td style={{ padding: '12px 14px' }}>Instant-Hours</td>
                    <td style={{ padding: '12px 14px' }}>🔬 Pure Theory</td>
                  </tr>
                </tbody>
              </table>
              <div style={{
                marginTop: '16px',
                padding: '12px 16px',
                background: '#e1f5fe',
                borderLeft: '4px solid #03a9f4',
                borderRadius: '4px',
                fontSize: '12px',
                color: '#0277bd'
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
              color: '#667eea',
              fontSize: '20px',
              fontWeight: '700',
              paddingBottom: '12px',
              borderBottom: '2px solid #f6f8fa'
            }}>
              🌌 Scale of the Cosmos: Moon to Universe Edge
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '12px',
                background: 'white'
              }}>
                <thead>
                  <tr style={{ background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)' }}>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: '700', color: '#667eea' }}>Destination</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: '700', color: '#667eea' }}>Distance</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: '700', color: '#667eea' }}>Chemical</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: '700', color: '#667eea' }}>300 km/s</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: '700', color: '#667eea' }}>0.2c</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: '700', color: '#667eea' }}>0.9c</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: '700', color: '#667eea' }}>Warp 10c</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: '700', color: '#667eea' }}>Warp 100c</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: '700', color: '#667eea' }}>Warp 1000c</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e1e4e8' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#24292e' }}>Moon</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: '11px' }}>384,400 km</td>
                    <td style={{ padding: '12px 14px' }}>~3 days</td>
                    <td style={{ padding: '12px 14px' }}>~21 min</td>
                    <td style={{ padding: '12px 14px' }}>~6 sec</td>
                    <td style={{ padding: '12px 14px' }}>~1.4 sec</td>
                    <td style={{ padding: '12px 14px', color: '#667eea', fontWeight: '600' }}>instant</td>
                    <td style={{ padding: '12px 14px', color: '#667eea', fontWeight: '600' }}>instant</td>
                    <td style={{ padding: '12px 14px', color: '#667eea', fontWeight: '600' }}>instant</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e1e4e8', background: '#f6f8fa' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#24292e' }}>Mars</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: '11px' }}>55–400M km</td>
                    <td style={{ padding: '12px 14px' }}>7–9 months</td>
                    <td style={{ padding: '12px 14px' }}>~2 days</td>
                    <td style={{ padding: '12px 14px' }}>~13 min</td>
                    <td style={{ padding: '12px 14px' }}>~3 min</td>
                    <td style={{ padding: '12px 14px', color: '#667eea', fontWeight: '600' }}>instant</td>
                    <td style={{ padding: '12px 14px', color: '#667eea', fontWeight: '600' }}>instant</td>
                    <td style={{ padding: '12px 14px', color: '#667eea', fontWeight: '600' }}>instant</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e1e4e8' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#24292e' }}>Jupiter</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: '11px' }}>~778M km</td>
                    <td style={{ padding: '12px 14px' }}>~6 years</td>
                    <td style={{ padding: '12px 14px' }}>~30 days</td>
                    <td style={{ padding: '12px 14px' }}>~36 min</td>
                    <td style={{ padding: '12px 14px' }}>~8 min</td>
                    <td style={{ padding: '12px 14px', color: '#667eea', fontWeight: '600' }}>instant</td>
                    <td style={{ padding: '12px 14px', color: '#667eea', fontWeight: '600' }}>instant</td>
                    <td style={{ padding: '12px 14px', color: '#667eea', fontWeight: '600' }}>instant</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e1e4e8', background: '#f6f8fa' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#24292e' }}>Pluto</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: '11px' }}>~5.9B km</td>
                    <td style={{ padding: '12px 14px' }}>~30–50 years</td>
                    <td style={{ padding: '12px 14px' }}>~228 days</td>
                    <td style={{ padding: '12px 14px' }}>~5.5 hours</td>
                    <td style={{ padding: '12px 14px' }}>~1.2 hours</td>
                    <td style={{ padding: '12px 14px', color: '#667eea', fontWeight: '600' }}>~4 min</td>
                    <td style={{ padding: '12px 14px', color: '#667eea', fontWeight: '600' }}>~24 sec</td>
                    <td style={{ padding: '12px 14px', color: '#667eea', fontWeight: '600' }}>~2.4 sec</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e1e4e8' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#24292e' }}>Oort Cloud</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: '11px' }}>~1 ly</td>
                    <td style={{ padding: '12px 14px', color: '#cb2431' }}>~18,000 years</td>
                    <td style={{ padding: '12px 14px', color: '#d73a49' }}>~1,000 years</td>
                    <td style={{ padding: '12px 14px' }}>~5 years</td>
                    <td style={{ padding: '12px 14px' }}>~1.1 years</td>
                    <td style={{ padding: '12px 14px', color: '#667eea', fontWeight: '600' }}>~36 days</td>
                    <td style={{ padding: '12px 14px', color: '#667eea', fontWeight: '600' }}>~3.6 days</td>
                    <td style={{ padding: '12px 14px', color: '#667eea', fontWeight: '600' }}>~8.7 hours</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e1e4e8', background: '#f6f8fa' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#24292e' }}>Proxima Centauri</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: '11px' }}>4.246 ly</td>
                    <td style={{ padding: '12px 14px', color: '#cb2431' }}>~75,000 years</td>
                    <td style={{ padding: '12px 14px', color: '#d73a49' }}>~4,240 years</td>
                    <td style={{ padding: '12px 14px' }}>~21 years</td>
                    <td style={{ padding: '12px 14px' }}>~4.7 years</td>
                    <td style={{ padding: '12px 14px', color: '#667eea', fontWeight: '600' }}>~5 months</td>
                    <td style={{ padding: '12px 14px', color: '#667eea', fontWeight: '600' }}>~15 days</td>
                    <td style={{ padding: '12px 14px', color: '#667eea', fontWeight: '600' }}>~1.5 days</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e1e4e8' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#24292e' }}>Orion Nebula</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: '11px' }}>~1,344 ly</td>
                    <td style={{ padding: '12px 14px', color: '#cb2431' }}>~24M years</td>
                    <td style={{ padding: '12px 14px', color: '#d73a49' }}>~1.3M years</td>
                    <td style={{ padding: '12px 14px' }}>~6,700 years</td>
                    <td style={{ padding: '12px 14px' }}>~1,500 years</td>
                    <td style={{ padding: '12px 14px', color: '#667eea', fontWeight: '600' }}>~134 years</td>
                    <td style={{ padding: '12px 14px', color: '#667eea', fontWeight: '600' }}>~13 years</td>
                    <td style={{ padding: '12px 14px', color: '#667eea', fontWeight: '600' }}>~1.3 years</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e1e4e8', background: '#f6f8fa' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#24292e' }}>Milky Way Center</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: '11px' }}>~26,700 ly</td>
                    <td style={{ padding: '12px 14px', color: '#cb2431' }}>~470M years</td>
                    <td style={{ padding: '12px 14px', color: '#d73a49' }}>~27M years</td>
                    <td style={{ padding: '12px 14px' }}>~133,000 years</td>
                    <td style={{ padding: '12px 14px' }}>~30,000 years</td>
                    <td style={{ padding: '12px 14px', color: '#667eea', fontWeight: '600' }}>~2,670 years</td>
                    <td style={{ padding: '12px 14px', color: '#667eea', fontWeight: '600' }}>~267 years</td>
                    <td style={{ padding: '12px 14px', color: '#667eea', fontWeight: '600' }}>~27 years</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e1e4e8' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#24292e' }}>Edge of Milky Way</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: '11px' }}>~100,000 ly</td>
                    <td style={{ padding: '12px 14px', color: '#cb2431' }}>~1.8B years</td>
                    <td style={{ padding: '12px 14px', color: '#d73a49' }}>~100M years</td>
                    <td style={{ padding: '12px 14px' }}>~500,000 years</td>
                    <td style={{ padding: '12px 14px' }}>~111,000 years</td>
                    <td style={{ padding: '12px 14px', color: '#667eea', fontWeight: '600' }}>~10,000 years</td>
                    <td style={{ padding: '12px 14px', color: '#667eea', fontWeight: '600' }}>~1,000 years</td>
                    <td style={{ padding: '12px 14px', color: '#667eea', fontWeight: '600' }}>~100 years</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e1e4e8', background: '#f6f8fa' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#24292e' }}>Andromeda Galaxy</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: '11px' }}>~2.5M ly</td>
                    <td style={{ padding: '12px 14px', color: '#cb2431' }}>~44B years</td>
                    <td style={{ padding: '12px 14px', color: '#d73a49' }}>~2.5B years</td>
                    <td style={{ padding: '12px 14px' }}>~12.5M years</td>
                    <td style={{ padding: '12px 14px' }}>~2.8M years</td>
                    <td style={{ padding: '12px 14px', color: '#667eea', fontWeight: '600' }}>~250,000 years</td>
                    <td style={{ padding: '12px 14px', color: '#667eea', fontWeight: '600' }}>~25,000 years</td>
                    <td style={{ padding: '12px 14px', color: '#667eea', fontWeight: '600' }}>~2,500 years</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e1e4e8' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#24292e' }}>Virgo Cluster</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: '11px' }}>~54M ly</td>
                    <td style={{ padding: '12px 14px', color: '#cb2431', fontWeight: '600' }}>impossible</td>
                    <td style={{ padding: '12px 14px', color: '#d73a49' }}>~54B years</td>
                    <td style={{ padding: '12px 14px' }}>~270M years</td>
                    <td style={{ padding: '12px 14px' }}>~60M years</td>
                    <td style={{ padding: '12px 14px', color: '#667eea', fontWeight: '600' }}>~5.4M years</td>
                    <td style={{ padding: '12px 14px', color: '#667eea', fontWeight: '600' }}>~540,000 years</td>
                    <td style={{ padding: '12px 14px', color: '#667eea', fontWeight: '600' }}>~54,000 years</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e1e4e8', background: '#f6f8fa' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#24292e' }}>GN-z11*</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: '11px' }}>~32B ly</td>
                    <td style={{ padding: '12px 14px', color: '#cb2431', fontWeight: '600' }}>impossible</td>
                    <td style={{ padding: '12px 14px', color: '#cb2431', fontWeight: '600' }}>impossible</td>
                    <td style={{ padding: '12px 14px' }}>~160B years</td>
                    <td style={{ padding: '12px 14px' }}>~35B years</td>
                    <td style={{ padding: '12px 14px', color: '#667eea', fontWeight: '600' }}>~3.2B years</td>
                    <td style={{ padding: '12px 14px', color: '#667eea', fontWeight: '600' }}>~320M years</td>
                    <td style={{ padding: '12px 14px', color: '#667eea', fontWeight: '600' }}>~32M years</td>
                  </tr>
                  <tr style={{ background: '#f6f8fa' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#24292e' }}>Observable Universe</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: '11px' }}>~46.5B ly</td>
                    <td style={{ padding: '12px 14px', color: '#cb2431', fontWeight: '600' }}>impossible</td>
                    <td style={{ padding: '12px 14px', color: '#cb2431', fontWeight: '600' }}>impossible</td>
                    <td style={{ padding: '12px 14px' }}>~232B years</td>
                    <td style={{ padding: '12px 14px' }}>~52B years</td>
                    <td style={{ padding: '12px 14px', color: '#667eea', fontWeight: '600' }}>~4.65B years</td>
                    <td style={{ padding: '12px 14px', color: '#667eea', fontWeight: '600' }}>~465M years</td>
                    <td style={{ padding: '12px 14px', color: '#667eea', fontWeight: '600' }}>~46.5M years</td>
                  </tr>
                </tbody>
              </table>
              <div style={{
                marginTop: '16px',
                padding: '12px 16px',
                background: '#fff3cd',
                borderLeft: '4px solid #ffc107',
                borderRadius: '4px',
                fontSize: '12px',
                color: '#856404'
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
          background: #f6f8fa !important;
        }
      `}</style>
    </div>
  );
}