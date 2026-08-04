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

export default function Users() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadUsers() {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(buildApiUrl('users'))
        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`)
        }

        const payload = await response.json()
        if (isMounted) {
          setItems(normalizeItems(payload, 'users'))
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unable to load users')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    void loadUsers()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <p className="text-uppercase fw-semibold text-primary mb-1">Users</p>
            <h2 className="h4 fw-bold mb-0">User roster</h2>
          </div>
        </div>

        {loading ? (
          <div className="text-muted">Loading users…</div>
        ) : error ? (
          <div className="alert alert-danger mb-0">{error}</div>
        ) : items.length === 0 ? (
          <div className="text-muted">No users were returned.</div>
        ) : (
          <div className="row g-3">
            {items.map((user, index) => (
              <div className="col-md-6" key={user.id || user._id || `${user.name || 'user'}-${index}`}>
                <div className="border rounded-3 p-3 h-100">
                  <h3 className="h6 fw-bold mb-1">{user.name || user.username || 'Unnamed user'}</h3>
                  <p className="text-muted mb-2">{user.email || user.role || 'No profile details available.'}</p>
                  <div className="small text-secondary">Fitness goal: {user.goal || user.fitnessGoal || 'Not specified'}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
