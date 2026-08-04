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

export default function Workouts() {
  const WORKOUTS_API =
  `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/workouts`
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadWorkouts() {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(WORKOUTS_API)
        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`)
        }

        const payload = await response.json()
        if (isMounted) {
          setItems(normalizeItems(payload, 'workouts'))
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unable to load workouts')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    void loadWorkouts()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <p className="text-uppercase fw-semibold text-primary mb-1">Workouts</p>
            <h2 className="h4 fw-bold mb-0">Workout plans</h2>
          </div>
        </div>

        {loading ? (
          <div className="text-muted">Loading workouts…</div>
        ) : error ? (
          <div className="alert alert-danger mb-0">{error}</div>
        ) : items.length === 0 ? (
          <div className="text-muted">No workouts were returned.</div>
        ) : (
          <div className="row g-3">
            {items.map((workout, index) => (
              <div className="col-md-6" key={workout.id || workout._id || `${workout.name || 'workout'}-${index}`}>
                <div className="border rounded-3 p-3 h-100">
                  <h3 className="h6 fw-bold mb-1">{workout.name || workout.title || 'Untitled workout'}</h3>
                  <p className="text-muted mb-2">{workout.description || 'No details provided.'}</p>
                  <div className="small text-secondary">Duration: {workout.duration || 'Not specified'}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
