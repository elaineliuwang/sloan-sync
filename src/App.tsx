import { useState } from 'react'
import './App.css'

type WorkflowStep = 'discover' | 'connect' | 'incentives' | 'connections'

function App() {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('discover')
  const [selectedMentor, setSelectedMentor] = useState<string | null>(null)

  const workflowSteps: { id: WorkflowStep; label: string }[] = [
    { id: 'discover', label: 'Discover' },
    { id: 'connect', label: 'Connect' },
    { id: 'incentives', label: 'Incentives' },
    { id: 'connections', label: 'My Connections' },
  ]

  // Mock grad students open to connecting (Visibility/Discovery)
  const gradStudents = [
    { id: '1', name: 'Sarah Chen', program: 'MBA', interests: ['Tech', 'Product Management'], openTo: ['Career chat', 'Mentorship'] },
    { id: '2', name: 'Marcus Johnson', program: 'MBA', interests: ['Consulting', 'Strategy'], openTo: ['Career chat', 'Collaboration'] },
    { id: '3', name: 'Priya Patel', program: 'Sloan Fellows', interests: ['Healthcare', 'Operations'], openTo: ['Mentorship'] },
  ]

  return (
    <div className="canvas-layout">
      {/* Course-level left navigation (Canvas style) */}
      <aside className="course-nav">
        <nav className="course-nav-list">
          <a href="#" className="course-nav-item">Home</a>
          <a href="#" className="course-nav-item">Student Resources</a>
          <a href="#" className="course-nav-item">Course Overview</a>
          <a href="#" className="course-nav-item">Assignments</a>
          <a href="#" className="course-nav-item">Announcements</a>
          <a href="#" className="course-nav-item">People</a>
          <a href="#" className="course-nav-item">Grades</a>
          <a href="#" className="course-nav-item course-nav-item--sloan active">Sloan Sync</a>
        </nav>
      </aside>

      {/* Main content area */}
      <main className="main-content">
        <header className="content-header">
          <div className="breadcrumb">
            <span className="breadcrumb-course">15.785_SP26</span>
            <span className="breadcrumb-sep">&gt;</span>
            <span className="breadcrumb-page">Sloan Sync</span>
          </div>
        </header>

        {/* Workflow steps - Core User Journey from slides */}
        <div className="workflow-nav">
          {workflowSteps.map((step, i) => (
            <button
              key={step.id}
              type="button"
              className={`workflow-step ${currentStep === step.id ? 'active' : ''}`}
              onClick={() => setCurrentStep(step.id)}
            >
              <span className="workflow-step-num">{i + 1}</span>
              <span className="workflow-step-label">{step.label}</span>
            </button>
          ))}
        </div>

        <div className="content-body">
          {/* Step 1: Visibility / Discovery of Grad Students */}
          {currentStep === 'discover' && (
            <section className="content-section">
              <h1 className="section-title">Discover Grad Students</h1>
              <p className="section-description">
                Find grad students in your course who are open to connecting. Built on shared classroom proximity—low-stakes, intentional networking on shared academic ground.
              </p>
              <div className="student-grid">
                {gradStudents.map((student) => (
                  <div key={student.id} className="student-card">
                    <div className="student-avatar">{student.name.charAt(0)}</div>
                    <div className="student-info">
                      <h3 className="student-name">{student.name}</h3>
                      <span className="student-program">{student.program}</span>
                      <div className="student-tags">
                        {student.interests.map((i) => (
                          <span key={i} className="tag">{i}</span>
                        ))}
                      </div>
                      <p className="student-open-to">Open to: {student.openTo.join(', ')}</p>
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() => {
                          setSelectedMentor(student.name)
                          setCurrentStep('connect')
                        }}
                      >
                        Request Connection
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Step 2: Structured Outreach & Interaction */}
          {currentStep === 'connect' && (
            <section className="content-section">
              <h1 className="section-title">Structured Outreach</h1>
              <p className="section-description">
                Reach out with intention. Choose the type of connection that fits—career exploration, mentorship, or collaboration. No initiation uncertainty.
              </p>
              <div className="card-section connect-form">
                <h2 className="subsection-title">
                  {selectedMentor ? `Request connection with ${selectedMentor}` : 'Request a connection'}
                </h2>
                <form className="outreach-form">
                  <div className="form-group">
                    <label htmlFor="connection-type">Connection type</label>
                    <select id="connection-type" className="form-select">
                      <option value="">Select...</option>
                      <option value="career-chat">Career chat — Explore industries & paths</option>
                      <option value="mentorship">Mentorship — Sustained 1:1 relationship</option>
                      <option value="collaboration">Collaboration — Project or study partnership</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">Brief message (optional)</label>
                    <textarea id="message" className="form-textarea" rows={4} placeholder="Introduce yourself and share what you hope to gain..." />
                  </div>
                  <button type="submit" className="btn-primary">Send request</button>
                </form>
                {selectedMentor && (
                  <button type="button" className="btn-link" onClick={() => setSelectedMentor(null)}>
                    ← Back to Discover
                  </button>
                )}
              </div>
            </section>
          )}

          {/* Step 3: Incentive System */}
          {currentStep === 'incentives' && (
            <section className="content-section">
              <h1 className="section-title">Incentives</h1>
              <p className="section-description">
                Earn recognition for building community. Track your progress and contribute to the positive feedback loop.
              </p>
              <div className="incentives-grid">
                <div className="incentive-card">
                  <div className="incentive-icon">🔗</div>
                  <h3>Connections made</h3>
                  <p className="incentive-value">2</p>
                  <p className="incentive-goal">Keep going! 3 more to unlock badge</p>
                </div>
                <div className="incentive-card">
                  <div className="incentive-icon">⭐</div>
                  <h3>First connection</h3>
                  <p className="incentive-value incentive-earned">Earned</p>
                </div>
                <div className="incentive-card locked">
                  <div className="incentive-icon">🏆</div>
                  <h3>Community builder</h3>
                  <p className="incentive-value">5+ connections</p>
                </div>
              </div>
            </section>
          )}

          {/* Step 4: Ongoing Relationship */}
          {currentStep === 'connections' && (
            <section className="content-section">
              <h1 className="section-title">My Connections</h1>
              <p className="section-description">
                Your sustained relationships. Meaningful mentorship and community—1–2 long-term connections that go beyond coursework.
              </p>
              <div className="connections-list">
                <div className="connection-card">
                  <div className="student-avatar">S</div>
                  <div className="connection-info">
                    <h3>Sarah Chen</h3>
                    <span className="connection-type">Mentorship (ongoing)</span>
                    <p className="connection-meta">Connected Mar 1, 2026 • Next touchpoint: Mar 15</p>
                  </div>
                </div>
                <div className="connection-card">
                  <div className="student-avatar">M</div>
                  <div className="connection-info">
                    <h3>Marcus Johnson</h3>
                    <span className="connection-type">Career chat (scheduled)</span>
                    <p className="connection-meta">Meeting: Mar 10, 1:05 PM</p>
                  </div>
                </div>
                <div className="connection-empty">
                  <p>Form 1–2 sustained relationships to build your Sloan network.</p>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Right sidebar - Sloan Sync context */}
      <aside className="right-sidebar">
        <div className="sidebar-section">
          <h3 className="sidebar-title">Your journey</h3>
          <div className="journey-flow">
            <div className="journey-item">Shared classroom</div>
            <div className="journey-arrow">→</div>
            <div className="journey-item">Discover</div>
            <div className="journey-arrow">→</div>
            <div className="journey-item">Connect</div>
            <div className="journey-arrow">→</div>
            <div className="journey-item">Ongoing relationship</div>
          </div>
        </div>
        <div className="sidebar-section">
          <h3 className="sidebar-title">Quick stats</h3>
          <ul className="stats-list">
            <li><span className="stat-value">2</span> active connections</li>
            <li><span className="stat-value">1</span> badge earned</li>
          </ul>
        </div>
        <div className="sidebar-actions">
          <button type="button" className="sidebar-btn">
            <span className="sidebar-btn-icon">📊</span>
            View Course Stream
          </button>
          <button type="button" className="sidebar-btn">
            <span className="sidebar-btn-icon">📅</span>
            View Course Calendar
          </button>
        </div>
      </aside>
    </div>
  )
}

export default App
