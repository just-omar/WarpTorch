import { FaGithub } from 'react-icons/fa'
import { SiJupyter, SiDocusaurus } from 'react-icons/si'
import { FiServer } from 'react-icons/fi'
import './Navbar.css'

interface NavbarProps {
  onHistoryToggle: () => void
  showHistory: boolean
}

const Navbar = ({ onHistoryToggle, showHistory }: NavbarProps) => {
  const links = [
    {
      url: 'https://github.com/just-omar/WarpTorch',
      icon: <FaGithub />,
      color: '#24292e',
      title: 'GitHub'
    },
    {
      url: `http://localhost:${import.meta.env.VITE_JUPYTER_PORT || '8888'}`,
      icon: <SiJupyter />,
      color: '#F37626',
      title: 'Jupyter'
    },
    {
      url: `http://localhost:${import.meta.env.VITE_DOCS_PORT || '3553'}`,
      icon: <SiDocusaurus />,
      color: '#667eea',
      title: 'Documentation'
    },
    {
      url: `http://localhost:${import.meta.env.VITE_BACKEND_PORT || '8099'}/docs`,
      icon: <FiServer />,
      color: '#21a0c4',
      title: 'Backend API'
    }
  ]

  return (
    <div className="navbar">
      <div className="navbar-links">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link-icon"
            style={{ '--icon-color': link.color } as React.CSSProperties}
            title={link.title}
          >
            {link.icon}
          </a>
        ))}
      </div>

      <button
        className={`history-toggle-btn ${showHistory ? 'active' : ''}`}
        onClick={onHistoryToggle}
        title="Simulation History"
      >
        📚 History
      </button>
    </div>
  )
}

export default Navbar
