import { useEffect, useState } from 'react'

function buildApiUrl(resource) {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
  const baseUrl = codespaceName ? `https://${codespaceName}-8000.app.github.dev` : 'http://localhost:8000'
  return `${baseUrl}/api/${resource}/`
}

function normalizeItems(payload, fallbackKey) {
  if (Array.isArray(payload)) {
    return payload
  }

  if (!payload || typeof payload !== 'object') {
    return []
  }

  const candidates = [fallbackKey, 'items', 'results', 'data', 'docs', 'records']

  for (const key of candidates) {
    if (Array.isArray(payload[key])) {
      return payload[key]
    }
  }

  return []
}

export default function Leaderboard() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadLeaderboard() {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(buildApiUrl('leaderboard'))
        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`)
        }

        const payload = await response.json()
        if (isMounted) {
          setItems(normalizeItems(payload, 'leaderboard'))
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unable to load leaderboard')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    void loadLeaderboard()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <p className="text-uppercase fw-semibold text-primary mb-1">Leaderboard</p>
            <h2 className="h4 fw-bold mb-0">Current rankings</h2>
          </div>
        </div>

        {loading ? (
          <div className="text-muted">Loading leaderboard…</div>
        ) : error ? (
          <div className="alert alert-danger mb-0">{error}</div>
        ) : items.length === 0 ? (
          <div className="text-muted">No leaderboard entries were returned.</div>
        ) : (
          <div className="row g-3">
            {items.map((entry, index) => (
              <div className="col-md-6" key={entry.id || entry._id || `${entry.name || 'entry'}-${index}`}>
                <div className="border rounded-3 p-3 h-100">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h3 className="h6 fw-bold mb-0">{entry.name || entry.user || 'Unknown entry'}</h3>
                    <span className="badge text-bg-primary">#{index + 1}</span>
                  </div>
                  <p className="text-muted mb-1">{entry.team || entry.group || 'No team provided'}</p>
                  <p className="fw-semibold mb-0">{entry.points || entry.score || 0} points</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
