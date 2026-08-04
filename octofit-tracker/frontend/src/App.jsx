import { NavLink, Route, Routes } from 'react-router-dom'
import Activities from './components/Activities.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Teams from './components/Teams.jsx'
import Users from './components/Users.jsx'
import Workouts from './components/Workouts.jsx'

function App() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
  const apiHealthUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/health`
    : 'http://localhost:8000/api/health'

  return (
    <div className="min-vh-100 bg-light">
      <header className="border-bottom bg-white">
        <div className="container py-4">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
            <div>
              <p className="text-uppercase fw-semibold text-primary mb-1">OctoFit Tracker</p>
              <h1 className="h2 fw-bold mb-0">Modern fitness tracking for teams and solo athletes.</h1>
            </div>
            <div className="d-flex flex-wrap gap-2">
              <a className="btn btn-outline-secondary" href={apiHealthUrl} target="_blank" rel="noreferrer">
                Check API health
              </a>
              <a className="btn btn-primary" href="/">
                Open dashboard
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-4">
        <nav className="nav nav-pills flex-wrap gap-2 mb-4">
          <NavLink className="nav-link" to="/">Overview</NavLink>
          <NavLink className="nav-link" to="/activities">Activities</NavLink>
          <NavLink className="nav-link" to="/leaderboard">Leaderboard</NavLink>
          <NavLink className="nav-link" to="/teams">Teams</NavLink>
          <NavLink className="nav-link" to="/users">Users</NavLink>
          <NavLink className="nav-link" to="/workouts">Workouts</NavLink>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <section className="row g-4 align-items-stretch">
                <div className="col-lg-7">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body p-4">
                      <p className="text-uppercase fw-semibold text-primary mb-2">Overview</p>
                      <h2 className="h3 fw-bold mb-3">Follow your training journey end to end.</h2>
                      <p className="lead text-muted mb-4">
                        Browse activity feed, team rosters, leaderboard rankings, and workout suggestions from one polished dashboard.
                      </p>
                      <p className="text-muted mb-0">
                        The presentation tier uses Vite environment variables such as <strong>VITE_CODESPACE_NAME</strong> to build its API URLs. Define it in <strong>.env.local</strong> when running behind GitHub Codespaces.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-5">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body p-4">
                      <h2 className="h4 mb-3">What’s included</h2>
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item px-0">React 19 + Vite frontend</li>
                        <li className="list-group-item px-0">Express + TypeScript API</li>
                        <li className="list-group-item px-0">MongoDB-ready Mongoose data layer</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
            }
          />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/users" element={<Users />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
