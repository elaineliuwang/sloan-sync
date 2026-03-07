import { useState } from 'react'
import './App.css'

type WorkflowStep = 'discover' | 'connect' | 'connections'

type Connection = {
  id: string
  name: string
  connectionType: string
  status: string
  interests: string[]
  school: string
}

type Student = {
  id: string
  name: string
  program: string
  school?: string
  interests: string[]
  openTo: string[]
}

function App() {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('discover')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [requestSentMessage, setRequestSentMessage] = useState(false)
  const [connections, setConnections] = useState<Connection[]>([
    { id: '1', name: 'Sarah Chen', connectionType: 'Mentorship (ongoing)', status: 'Connected Mar 1, 2026 • Next touchpoint: Mar 15', interests: ['Tech', 'Product Management'], school: 'MIT Sloan' },
    { id: '2', name: 'Marcus Johnson', connectionType: 'Career chat (scheduled)', status: 'Meeting: Mar 10, 1:05 PM', interests: ['Consulting', 'Strategy'], school: 'MIT Sloan' },
  ])

  const workflowSteps: { id: WorkflowStep; label: string }[] = [
    { id: 'discover', label: 'Discover' },
    { id: 'connect', label: 'Connect' },
    { id: 'connections', label: 'My Connections' },
  ]

  // Mock grad students in this course - filter out anyone already in connections
  const allGradStudents: Student[] = [
    { id: '1', name: 'Sarah Chen', program: 'MBA', school: 'MIT Sloan', interests: ['Tech', 'Product Management'], openTo: ['Career chat', 'Mentorship'] },
    { id: '2', name: 'Marcus Johnson', program: 'MBA', school: 'MIT Sloan', interests: ['Consulting', 'Strategy'], openTo: ['Career chat', 'Collaboration'] },
    { id: '3', name: 'Priya Patel', program: 'Sloan Fellows', school: 'MIT Sloan', interests: ['Healthcare', 'Operations'], openTo: ['Mentorship'] },
  ]
  const connectedNames = new Set(connections.map((c) => c.name))
  const gradStudents = allGradStudents.filter((s) => !connectedNames.has(s.name))

  // Students from other schools - shown when class is fully discovered, matched by similar interests
  const otherSchoolsStudents: Student[] = [
    { id: 'ext-1', name: 'Alex Rivera', program: 'MBA', school: 'Harvard Business School', interests: ['Tech', 'Product Management', 'Venture Capital'], openTo: ['Career chat', 'Mentorship'] },
    { id: 'ext-2', name: 'Jordan Kim', program: 'MBA', school: 'MIT Sloan (15.761)', interests: ['Consulting', 'Strategy', 'Operations'], openTo: ['Career chat', 'Collaboration'] },
    { id: 'ext-3', name: 'Taylor Williams', program: 'MBA', school: 'Boston University Questrom', interests: ['Healthcare', 'Biotech'], openTo: ['Mentorship'] },
    { id: 'ext-4', name: 'Morgan Davis', program: 'Masters', school: 'Wellesley College', interests: ['Product Management', 'Social Impact'], openTo: ['Career chat', 'Collaboration'] },
    { id: 'ext-5', name: 'Riley O\'Brien', program: 'MBA', school: 'Boston College Carroll', interests: ['Consulting', 'Tech'], openTo: ['Mentorship'] },
    { id: 'ext-6', name: 'Casey Zhang', program: 'MBA', school: 'Harvard Business School', interests: ['Operations', 'Healthcare'], openTo: ['Career chat'] },
  ]
  const userInterests = new Set(connections.flatMap((c) => c.interests))
  const suggestedStudents = otherSchoolsStudents
    .filter((s) => !connectedNames.has(s.name))
    .map((s) => ({
      ...s,
      matchScore: s.interests.filter((i) => userInterests.has(i)).length,
    }))
    .sort((a, b) => b.matchScore - a.matchScore)

  const handleSubmitRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const connectionTypeSelect = form.querySelector<HTMLSelectElement>('#connection-type')
    const type = connectionTypeSelect?.value || 'Connection requested'
    const typeLabel =
      type === 'career-chat' ? 'Career chat (pending)' :
      type === 'mentorship' ? 'Mentorship (pending)' :
      type === 'collaboration' ? 'Collaboration (pending)' :
      'Connection (pending)'

    if (selectedStudent) {
      const newConnection: Connection = {
        id: String(Date.now()),
        name: selectedStudent.name,
        connectionType: typeLabel,
        status: 'Request sent—waiting for response',
        interests: selectedStudent.interests,
        school: selectedStudent.school ?? 'MIT Sloan',
      }
      setConnections((prev) => [...prev, newConnection])
      setRequestSentMessage(true)
      setSelectedStudent(null)
      setCurrentStep('connections')
      form.reset()
    }
  }

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

        {/* Workflow steps */}
        <div className="workflow-nav">
          {workflowSteps.map((step, i) => (
            <button
              key={step.id}
              type="button"
              className={`workflow-step ${currentStep === step.id ? 'active' : ''}`}
              onClick={() => {
                setCurrentStep(step.id)
                setRequestSentMessage(false)
              }}
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
                {gradStudents.length > 0 && (
                  <>
                    <h2 className="subsection-title discover-subsection">In your class</h2>
                    {gradStudents.map((student) => (
                    <div key={student.id} className="student-card">
                      <div className="student-avatar">{student.name.charAt(0)}</div>
                      <div className="student-info">
                        <h3 className="student-name">{student.name}</h3>
                        <span className="student-program">{student.program}</span>
                        <p className="student-interests">
                          <strong>Interests:</strong> {student.interests.join(', ')}
                        </p>
                        <p className="student-open-to">Open to: {student.openTo.join(', ')}</p>
                        <button
                          type="button"
                          className="btn-primary"
                          onClick={() => {
                            setSelectedStudent(student)
                            setCurrentStep('connect')
                          }}
                        >
                          Request Connection
                        </button>
                      </div>
                    </div>
                  ))}
                  </>
                )}
                {gradStudents.length === 0 && (
                  <div className="discover-empty">
                    <p>You&apos;ve discovered everyone in your class!</p>
                  </div>
                )}
                {suggestedStudents.length > 0 && (
                  <div className="suggestions-section">
                    <h2 className="subsection-title">Suggested connections · Similar interests</h2>
                    <p className="section-description suggestions-intro">
                      People from other MIT Sloan classes, Harvard, Wellesley, and Boston-area schools who share your interests.
                    </p>
                    <div className="student-grid suggestions-grid">
                      {suggestedStudents.map((student) => (
                        <div key={student.id} className="student-card student-card--external">
                          <div className="student-avatar">{student.name.charAt(0)}</div>
                          <div className="student-info">
                            <h3 className="student-name">{student.name}</h3>
                            <span className="student-program">{student.program} · {student.school}</span>
                            <p className="student-interests">
                              <strong>Interests:</strong> {student.interests.join(', ')}
                            </p>
                            <p className="student-open-to">Open to: {student.openTo.join(', ')}</p>
                            <button
                              type="button"
                              className="btn-primary"
                              onClick={() => {
                                setSelectedStudent(student)
                                setCurrentStep('connect')
                              }}
                            >
                              Request Connection
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                  {selectedStudent ? `Request connection with ${selectedStudent.name}` : 'Request a connection'}
                </h2>
                {selectedStudent && (
                  <div className="connect-profile-preview">
                    <div className="student-avatar">{selectedStudent.name.charAt(0)}</div>
                    <div className="connect-preview-info">
                      <span className="student-program">{selectedStudent.program}{selectedStudent.school ? ` · ${selectedStudent.school}` : ''}</span>
                      <p className="student-interests"><strong>Interests:</strong> {selectedStudent.interests.join(', ')}</p>
                    </div>
                  </div>
                )}
                <form className="outreach-form" onSubmit={handleSubmitRequest}>
                  <div className="form-group">
                    <label htmlFor="connection-type">Connection type</label>
                    <select id="connection-type" className="form-select" required>
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
                {selectedStudent && (
                  <button type="button" className="btn-link" onClick={() => setSelectedStudent(null)}>
                    ← Back to Discover
                  </button>
                )}
              </div>
            </section>
          )}

          {/* Step 3: My Connections */}
          {currentStep === 'connections' && (
            <section className="content-section">
              {requestSentMessage && (
                <div className="success-message">Request sent!</div>
              )}
              <h1 className="section-title">My Connections</h1>
              <p className="section-description">
                Your sustained relationships. Meaningful mentorship and community—1–2 long-term connections that go beyond coursework.
              </p>
              <div className="connections-list">
                {connections.map((conn) => (
                  <div key={conn.id} className="connection-card">
                    <div className="student-avatar">{conn.name.charAt(0)}</div>
                    <div className="connection-info">
                      <h3>{conn.name}</h3>
                      <span className="connection-type">{conn.connectionType}</span>
                      {conn.interests.length > 0 && (
                        <p className="connection-interests">Interests: {conn.interests.join(', ')}</p>
                      )}
                      <p className="connection-meta">{conn.status}</p>
                    </div>
                  </div>
                ))}
                {connections.length < 2 && (
                  <div className="connection-empty">
                    <p>Form 1–2 sustained relationships to build your Sloan network.</p>
                  </div>
                )}
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
            <li><span className="stat-value">{connections.length}</span> active connections</li>
            <li><span className="stat-value">{connections.length >= 1 ? 1 : 0}</span> badge earned</li>
          </ul>
        </div>
        <div className="sidebar-section">
          <h3 className="sidebar-title">Incentives</h3>
          <div className="sidebar-incentives">
            <div className="incentive-mini">
              <span className="incentive-mini-icon">🔗</span>
              <span>Connections: {connections.length}</span>
            </div>
            <div className="incentive-mini">
              <span className="incentive-mini-icon">⭐</span>
              <span>First connection {connections.length >= 1 ? '✓' : '—'}</span>
            </div>
            <div className="incentive-mini locked">
              <span className="incentive-mini-icon">🏆</span>
              <span>Community builder (5+ connections)</span>
            </div>
          </div>
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
