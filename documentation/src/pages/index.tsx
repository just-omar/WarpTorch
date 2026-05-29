import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function Home(): JSX.Element {
  return (
    <Layout
      title="WarpTorch - GPU-Accelerated General Relativity Toolkit"
      description="High-performance GPU-accelerated toolkit for simulating warp drive spacetimes using PyTorch">
      <main style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            Welcome to WarpTorch
          </h1>
          <p style={{ fontSize: '1.5rem', color: 'var(--ifm-color-emphasis-600)' }}>
            GPU-Accelerated General Relativity Toolkit
          </p>

          <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
            <img
              src="/WarpTorch/img/Warptoch-demo.gif"
              alt="WarpTorch Demo"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
            />
          </div>

          <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/docs/intro"
              style={{
                padding: '1rem 2rem',
                backgroundColor: 'var(--ifm-color-primary)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: 'bold'
              }}>
              Get Started
            </Link>
            <Link
              to="/docs/quick-start"
              style={{
                padding: '1rem 2rem',
                backgroundColor: '#25c2a0',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: 'bold'
              }}>
              Quick Start
            </Link>
          </div>

          <div style={{ marginTop: '4rem', textAlign: 'left' }}>
            <h2>Key Features</h2>
            <ul style={{ lineHeight: '2' }}>
              <li>🚀 <strong>Massive Acceleration:</strong> GPU-accelerated tensor computations with CUDA, ROCm, and Intel Arc support</li>
              <li>📚 <strong>Comprehensive Library:</strong> Vectorized implementations of classical and novel warp metrics</li>
              <li>🔬 <strong>Advanced Solvers:</strong> 4th-order finite difference stencils for Einstein's field equations</li>
              <li>🌐 <strong>Web-Ready Export:</strong> JSON exporters for WebGL frontend integration</li>
            </ul>
          </div>

          <div style={{ marginTop: '3rem' }}>
            <h2>Quick Links</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
              <Link to="/docs/api/metrics" style={{ padding: '1rem', border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: '8px', textDecoration: 'none', color: 'inherit' }}>
                <strong>API Reference</strong><br />Explore warp metrics
              </Link>
              <Link to="/docs/api/metrics" style={{ padding: '1rem', border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: '8px', textDecoration: 'none', color: 'inherit' }}>
                <strong>API Reference</strong><br />Explore the API
              </Link>
              <Link to="/docs/quick-start" style={{ padding: '1rem', border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: '8px', textDecoration: 'none', color: 'inherit' }}>
                <strong>Quick Start</strong><br />Get started quickly
              </Link>
              <Link to="/blog" style={{ padding: '1rem', border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: '8px', textDecoration: 'none', color: 'inherit' }}>
                <strong>Blog</strong><br />Latest updates
              </Link>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}