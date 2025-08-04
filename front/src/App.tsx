import { useState } from 'react'
import UserManager from './components/UserManager'
import CardManager from './components/CardManager'
import './App.css'

type ActiveTab = 'users' | 'cards';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('users')

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* 导航栏 */}
      <nav style={{ 
        backgroundColor: '#343a40', 
        padding: '1rem 0',
        marginBottom: '2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h1 style={{ 
            color: 'white', 
            margin: 0,
            fontSize: '1.5rem'
          }}>
            Rust + React 管理系统
          </h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setActiveTab('users')}
              style={{
                backgroundColor: activeTab === 'users' ? '#007bff' : 'transparent',
                color: 'white',
                border: '1px solid #007bff',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              用户管理
            </button>
            <button
              onClick={() => setActiveTab('cards')}
              style={{
                backgroundColor: activeTab === 'cards' ? '#007bff' : 'transparent',
                color: 'white',
                border: '1px solid #007bff',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              卡片管理
            </button>
          </div>
        </div>
      </nav>

      {/* 主要内容区域 */}
      <main>
        {activeTab === 'users' && <UserManager />}
        {activeTab === 'cards' && <CardManager />}
      </main>
    </div>
  )
}

export default App
