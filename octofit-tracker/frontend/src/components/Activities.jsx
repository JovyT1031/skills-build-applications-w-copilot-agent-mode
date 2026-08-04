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

export default function Activities() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadActivities() {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(buildApiUrl('activities'))
        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`)
        }

        const payload = await response.json()
        if (isMounted) {
          setItems(normalizeItems(payload, 'activities'))
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unable to load activities')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    void loadActivities()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <p className="text-uppercase fw-semibold text-primary mb-1">Activities</p>
            <h2 className="h4 fw-bold mb-0">Recent activity feed</h2>
          </div>
        </div>

        {loading ? (
          <div className="text-muted">Loading activities…</div>
        ) : error ? (
          <div className="alert alert-danger mb-0">{error}</div>
        ) : items.length === 0 ? (
          <div className="text-muted">No activity entries were returned.</div>
        ) : (
          <div className="row g-3">
            {items.map((activity, index) => (
              <div className="col-md-6" key={activity.id || activity._id || `${activity.type || 'activity'}-${index}`}>
                <div className="border rounded-3 p-3 h-100">
                  <p className="fw-semibold mb-1">{activity.title || activity.type || 'Activity'}</p>
                  <p className="text-muted mb-2">{activity.description || 'No description provided.'}</p>
                  <div className="small text-secondary">
                    <span className="me-3">{activity.user || activity.username || 'Unknown user'}</span>
                    <span>{activity.date || activity.createdAt || 'Unknown date'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
