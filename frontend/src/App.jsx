import { useState, useEffect } from 'react'

function App() {
  const [apiStatus, setApiStatus] = useState('Loading backend status...')

  useEffect(() => {
    fetch('http://localhost:8000/health')
      .then(res => res.json())
      .then(data => setApiStatus(data.status))
      .catch(err => setApiStatus('Backend unreachable: ' + err.message))
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-700 hover:border-blue-500/50 transition-colors duration-300">
        <div className="p-8 text-center relative overflow-hidden">
          {/* Decorative background glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-4 relative z-10">
            Kinetic MVP Running
          </h1>
          <p className="text-slate-400 text-lg mb-8 relative z-10">
            AI-driven team matchmaking platform.
          </p>
          <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50 shadow-inner relative z-10">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">API Status</h2>
            <div className="flex items-center justify-center space-x-3">
              <span className={`h-3 w-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] ${apiStatus.includes('live') ? 'bg-emerald-400 shadow-emerald-400/50 animate-pulse' : 'bg-rose-500 shadow-rose-500/50'}`}></span>
              <span className={`font-mono font-medium ${apiStatus.includes('live') ? 'text-emerald-300' : 'text-rose-400'}`}>
                {apiStatus}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
