import { FaGithub } from 'react-icons/fa'
import { SiJupyter, SiDocusaurus } from 'react-icons/si'
import { FiServer } from 'react-icons/fi'
import './LinksPanel.css'

interface LinksPanelProps {
  onClose: () => void
}

const LinksPanel = ({ onClose }: LinksPanelProps) => {
  const links = [
    {
      title: 'GitHub',
      url: 'https://github.com/just-omar/WarpTorch',
      icon: <FaGithub />,
      description: 'Repository',
      color: '#24292e'
    },
    {
      title: 'Jupyter',
      url: 'http://localhost:8888',
      icon: <SiJupyter />,
      description: 'Notebooks',
      color: '#F37626'
    },
    {
      title: 'Documentation',
      url: 'http://localhost:3553',
      icon: <SiDocusaurus />,
      description: 'Docusaurus',
      color: '#667eea'
    },
    {
      title: 'Backend API',
      url: 'http://localhost:8099',
      icon: <FiServer />,
      description: 'FastAPI',
      color: '#21a0c4'
    }
  ]

  return (
    <div className="links-overlay" onClick={onClose}>
      <div className="links-panel" onClick={e => e.stopPropagation()}>
        <div className="links-header">
          <h2>🚀 Quick Links</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="links-grid">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-card"
              style={{ '--card-color': link.color } as React.CSSProperties}
            >
              <div className="link-icon">{link.icon}</div>
              <div className="link-info">
                <div className="link-title">{link.title}</div>
                <div className="link-description">{link.description}</div>
                <div className="link-url">{link.url}</div>
              </div>
              <div className="link-arrow">→</div>
            </a>
          ))}
        </div>

        <div className="links-footer">
          <p>WarpTorch • General Relativity Warp Metrics</p>
        </div>
      </div>
    </div>
  )
}

export default LinksPanel
