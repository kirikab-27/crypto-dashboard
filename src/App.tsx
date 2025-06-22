import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1>🚀 VIBE Coding Template</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        AI開発用のプロジェクトテンプレートです
      </p>
      
      <div style={{ marginBottom: '2rem' }}>
        <button 
          onClick={() => setCount((count) => count + 1)}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            backgroundColor: '#007acc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          count is {count}
        </button>
      </div>

      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '1rem', 
        borderRadius: '8px',
        marginTop: '2rem'
      }}>
        <h3>✨ 使い方</h3>
        <ol style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
          <li>このテンプレートをコピーして新しいプロジェクトを作成</li>
          <li><code>.ai/context.md</code> でプロジェクト情報を更新</li>
          <li><code>.ai/CLAUDE.md</code> の技術スタック情報を更新</li>
          <li>Claude Codeを使って開発を開始！</li>
        </ol>
      </div>

      <div style={{ 
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#e8f4fd',
        borderRadius: '8px'
      }}>
        <p><strong>📚 参考:</strong></p>
        <p>実装例として <code>markdown-memo-app</code> を参照してください</p>
      </div>
    </div>
  )
}

export default App