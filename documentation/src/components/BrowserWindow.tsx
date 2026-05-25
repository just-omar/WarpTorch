import React from 'react';

export default function BrowserWindow({children, title}): React.Element {
  return (
    <div style={{
      border: '1px solid #e1e4e8',
      borderRadius: '8px',
      margin: '24px 0',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        background: '#f6f8fa',
        borderBottom: '1px solid #e1e4e8',
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{
          display: 'flex',
          gap: '6px'
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#ff5f56'
          }} />
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#ffbd2e'
          }} />
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#27c93f'
          }} />
        </div>
        {title && (
          <div style={{
            marginLeft: '16px',
            fontSize: '13px',
            color: '#586069',
            fontFamily: 'monospace'
          }}>
            {title}
          </div>
        )}
      </div>
      <div style={{
        padding: '16px',
        background: '#ffffff'
      }}>
        {children}
      </div>
    </div>
  );
}
