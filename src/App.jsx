
import { useRef, useState } from 'react'
import './App.css'

const initialChores = [
  { id: 1, title: 'Make your bed', child: 'Alex', points: 10, status: 'Pending review', icon: '🛏️', proof: '' },
  { id: 2, title: 'Water the plants', child: 'Alex', points: 15, status: 'Available', icon: '🪴', proof: '' },
  { id: 3, title: 'Organize study table', child: 'Emma', points: 20, status: 'Available', icon: '📚', proof: '' },
  { id: 4, title: 'Help set the table', child: 'Emma', points: 15, status: 'Approved', icon: '🍽️', proof: '' },
]

const moneyPerPoint = 0.5

function App() {
  const [chores, setChores] = useState(initialChores)
  const [page, setPage] = useState('Dashboard')
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [child, setChild] = useState('Alex')
  const [points, setPoints] = useState('10')
  const [icon, setIcon] = useState('⭐')
  const [message, setMessage] = useState('')
  const fileRefs = useRef({})

  const approvedChores = chores.filter(c => c.status === 'Approved')
  const pendingChores = chores.filter(c => c.status === 'Pending review')
  const availableChores = chores.filter(c => c.status === 'Available')
  const totalPoints = approvedChores.reduce((sum, c) => sum + c.points, 0)
  const earnedMoney = totalPoints * moneyPerPoint

  const updateChore = (id, updates) => {
    setChores(current =>
      current.map(chore => chore.id === id ? { ...chore, ...updates } : chore)
    )
  }

  const addChore = (event) => {
    event.preventDefault()
    if (!title.trim() || Number(points) < 1) return

    setChores(current => [
      ...current,
      {
        id: Date.now(),
        title: title.trim(),
        child,
        points: Number(points),
        icon,
        status: 'Available',
        proof: '',
      },
    ])

    setTitle('')
    setPoints('10')
    setIcon('⭐')
    setShowForm(false)
    setPage('Chores')
    setMessage('New chore added successfully!')
    window.setTimeout(() => setMessage(''), 3000)
  }

  const uploadProof = (id, file) => {
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setMessage('Please choose an image file.')
      window.setTimeout(() => setMessage(''), 3000)
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage('Please choose an image smaller than 5 MB.')
      window.setTimeout(() => setMessage(''), 3000)
      return
    }

    const preview = URL.createObjectURL(file)
    updateChore(id, { proof: preview })
    setMessage('Photo added. You can now review the chore.')
    window.setTimeout(() => setMessage(''), 3000)
  }

  const approveChore = (chore) => {
    if (!chore.proof) {
      setMessage('Upload a photo proof before approving this chore.')
      window.setTimeout(() => setMessage(''), 3000)
      return
    }

    updateChore(chore.id, { status: 'Approved' })
    setMessage(`${chore.child} earned ${chore.points} points!`)
    window.setTimeout(() => setMessage(''), 3000)
  }

  const rejectChore = (id) => {
    updateChore(id, { status: 'Available', proof: '' })
    setMessage('Chore returned for completion.')
    window.setTimeout(() => setMessage(''), 3000)
  }

  const navItems = [
    { name: 'Dashboard', icon: '🏠' },
    { name: 'Chores', icon: '📋' },
    { name: 'Rewards', icon: '🎁' },
  ]

  const visibleChores =
    page === 'Chores'
      ? chores
      : page === 'Rewards'
        ? approvedChores
        : pendingChores

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" onClick={e => { e.preventDefault(); setPage('Dashboard') }}>
          <span className="brand-mark">✓</span>
          <span>Check<span className="brand-light">Bounty</span></span>
        </a>

        <div className="family-switcher">
          <span className="family-avatar">🏡</span>
          <span><strong>Johnson Family</strong><small>Family workspace</small></span>
          <span className="switch-arrow">⌄</span>
        </div>

        <p className="nav-label">WORKSPACE</p>
        <nav className="nav-list">
          {navItems.map(item => (
            <button
              key={item.name}
              className={`nav-item ${page === item.name ? 'active' : ''}`}
              onClick={() => setPage(item.name)}
            >
              <span>{item.icon}</span>
              {item.name}
              {item.name === 'Chores' && pendingChores.length > 0 && (
                <span className="nav-count">{pendingChores.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-tip">
          <span className="tip-star">✨</span>
          <h3>Little tasks, big wins!</h3>
          <p>Every chore helps your family grow together.</p>
        </div>

        <div className="sidebar-bottom">
          <span className="parent-avatar">👩🏻</span>
          <span><strong>Parent account</strong><small>Family manager</small></span>
          <span className="more-icon">•••</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="mobile-brand">
            <span className="brand-mark">✓</span> CheckBounty
          </div>
          <div className="breadcrumb">Family workspace <span>/</span> {page}</div>
          <div className="topbar-right">
            <span className="today-pill">💜 Making progress together</span>
            <span className="parent-avatar top-avatar">👩🏻</span>
          </div>
        </header>

        <div className="page-content">
          <section className="welcome-banner">
            <div className="welcome-copy">
              <span className="welcome-tag">YOUR FAMILY, YOUR TEAM ✨</span>
              <h1>{page === 'Dashboard' ? 'Hey, Parent! 👋' : page === 'Chores' ? 'Chore central 📋' : 'Little wins, lovely rewards 🎁'}</h1>
              <p>
                {page === 'Dashboard'
                  ? 'Make everyday chores a little more fun for everyone.'
                  : page === 'Chores'
                    ? 'Create tasks, track progress, and celebrate every effort.'
                    : 'See the points your little helpers have earned.'}
              </p>
              <button className="primary-btn banner-btn" onClick={() => setShowForm(true)}>
                <span>＋</span> Create a chore
              </button>
            </div>
            <div className="banner-art" aria-hidden="true">
              <span className="art-sparkle sparkle-one">✦</span>
              <span className="art-sparkle sparkle-two">✧</span>
              <div className="art-coin">⭐</div>
              <div className="art-trophy">🏆</div>
              <div className="art-points">+20 pts!</div>
              <span className="art-heart">💜</span>
            </div>
          </section>

          {message && <div className="toast" role="status">✨ {message}</div>}

          <section className="stats-grid">
            <article className="stat-card points-card">
              <div className="stat-top"><span className="stat-icon purple-icon">⭐</span><span className="stat-caption">ALL-TIME EARNINGS</span></div>
              <p>Total family points</p>
              <h2>{totalPoints} <small>pts</small></h2>
              <div className="stat-foot"><span>🌟</span> Keep the good work going!</div>
            </article>
            <article className="stat-card review-card">
              <div className="stat-top"><span className="stat-icon peach-icon">📝</span><span className="stat-caption">NEEDS YOUR EYES</span></div>
              <p>Waiting for review</p>
              <h2>{pendingChores.length} <small>{pendingChores.length === 1 ? 'chore' : 'chores'}</small></h2>
              <div className="stat-foot"><span>💌</span> Your little helpers are waiting</div>
            </article>
            <article className="stat-card money-card">
              <div className="stat-top"><span className="stat-icon green-icon">🐷</span><span className="stat-caption">ESTIMATED REWARDS</span></div>
              <p>Money earned</p>
              <h2>₹{earnedMoney.toFixed(2)}</h2>
              <div className="stat-foot"><span>💜</span> ₹{moneyPerPoint.toFixed(2)} per point</div>
            </article>
          </section>

          {page === 'Dashboard' && (
            <>
              <section className="section-block">
                <div className="section-heading">
                  <div><span className="section-kicker">A LITTLE HELP GOES A LONG WAY</span><h2>Needs your approval <span className="heading-emoji">💌</span></h2><p>Check the photo proof before awarding points.</p></div>
                  <button className="text-btn" onClick={() => setPage('Chores')}>View all chores →</button>
                </div>

                {pendingChores.length === 0 ? (
                  <div className="empty-state"><span>🎉</span><h3>All caught up!</h3><p>New chores submitted by your children will appear here.</p></div>
                ) : (
                  <div className="review-grid">
                    {pendingChores.map(chore => (
                      <article className="review-card-item" key={chore.id}>
                        <div className="review-item-top">
                          <span className="chore-emoji">{chore.icon}</span>
                          <span className="pending-badge">● Needs review</span>
                        </div>
                        <h3>{chore.title}</h3>
                        <p className="child-line"><span className="child-dot">{chore.child === 'Alex' ? '👦🏻' : '👧🏻'}</span> Submitted by {chore.child}</p>
                        {chore.proof ? (
                          <img className="proof-preview" src={chore.proof} alt={`Photo proof for ${chore.title}`} />
                        ) : (
                          <div className="proof-placeholder">
                            <span>📸</span><strong>Photo proof needed</strong><small>Attach a demo photo to review this task.</small>
                          </div>
                        )}
                        <div className="review-actions">
                          <label className="upload-btn">
                            📷 {chore.proof ? 'Change photo' : 'Add photo proof'}
                            <input
                              type="file"
                              accept="image/*"
                              ref={el => { fileRefs.current[chore.id] = el }}
                              onChange={e => uploadProof(chore.id, e.target.files?.[0])}
                              hidden
                            />
                          </label>
                          <button className="approve-btn" onClick={() => approveChore(chore)}>✓ Approve</button>
                          <button className="reject-btn" title="Return chore" onClick={() => rejectChore(chore.id)}>↺</button>
                        </div>
                        <div className="points-strip">⭐ {chore.points} points <span>≈ ₹{(chore.points * moneyPerPoint).toFixed(2)}</span></div>
                      </article>
                    ))}
                  </div>
                )}
              </section>

              <section className="section-block">
                <div className="section-heading">
                  <div><span className="section-kicker">READY WHEN THEY ARE</span><h2>Available chores <span className="heading-emoji">🌈</span></h2><p>Tasks waiting for your children to get started.</p></div>
                  <button className="text-btn" onClick={() => setPage('Chores')}>Manage chores →</button>
                </div>
                <ChoreList chores={availableChores.slice(0, 4)} />
              </section>
            </>
          )}

          {page === 'Chores' && (
            <section className="section-block">
              <div className="section-heading">
                <div><span className="section-kicker">YOUR FAMILY TASK BOARD</span><h2>All chores <span className="heading-emoji">🧩</span></h2><p>Manage every task from one place.</p></div>
                <button className="primary-btn" onClick={() => setShowForm(true)}>＋ New chore</button>
              </div>
              <div className="filter-pills">
                <span>{chores.length} total tasks</span><span>{availableChores.length} available</span><span>{pendingChores.length} pending</span><span>{approvedChores.length} approved</span>
              </div>
              <ChoreList chores={visibleChores} showStatus />
            </section>
          )}

          {page === 'Rewards' && (
            <section className="section-block">
              <div className="section-heading">
                <div><span className="section-kicker">EVERY EFFORT COUNTS</span><h2>Family reward ledger <span className="heading-emoji">💰</span></h2><p>Approved chores add points and estimated pocket money.</p></div>
              </div>
              <div className="ledger-banner"><span>🐷</span><div><small>COMBINED FAMILY REWARDS</small><h2>₹{earnedMoney.toFixed(2)}</h2><p>{totalPoints} approved points · ₹{moneyPerPoint.toFixed(2)} per point</p></div></div>
              {approvedChores.length === 0 ? (
                <div className="empty-state"><span>🎁</span><h3>Your reward journey starts here</h3><p>Approve a completed chore to see it in the reward ledger.</p></div>
              ) : (
                <div className="ledger-list">
                  {approvedChores.map(chore => (
                    <div className="ledger-row" key={chore.id}>
                      <span className="chore-emoji">{chore.icon}</span>
                      <div className="ledger-description"><strong>{chore.title}</strong><small>{chore.child} · Approved chore</small></div>
                      <div className="ledger-amount"><strong>+{chore.points} pts</strong><small>₹{(chore.points * moneyPerPoint).toFixed(2)}</small></div>
                    </div>
                  ))}
                </div>
              )}
              <p className="demo-note">Pocket money is an estimate for family tracking. No real payment is processed.</p>
            </section>
          )}

          <footer className="page-footer">Made with 💜 for happier families · <strong>CheckBounty</strong></footer>
        </div>
      </main>

      {showForm && (
        <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setShowForm(false) }}>
          <form className="chore-form" onSubmit={addChore}>
            <div className="modal-heading"><div><span className="section-kicker">MAKE IT A LITTLE ADVENTURE</span><h2>Create a chore ✨</h2><p>Give your little helper a task to tackle.</p></div><button type="button" className="close-btn" onClick={() => setShowForm(false)}>×</button></div>
            <label>Chore name<input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Feed the pet" required maxLength={80} /></label>
            <label>Assign to<select value={child} onChange={e => setChild(e.target.value)}><option>Alex</option><option>Emma</option></select></label>
            <label>Reward points<input type="number" min="1" max="1000" value={points} onChange={e => setPoints(e.target.value)} required /></label>
            <label>Pick an icon</label>
            <div className="emoji-picker">{['⭐', '🧹', '🪴', '📚', '🛏️', '🍽️', '🐶', '🧺'].map(emoji => <button type="button" key={emoji} className={icon === emoji ? 'emoji-choice selected' : 'emoji-choice'} onClick={() => setIcon(emoji)}>{emoji}</button>)}</div>
            <div className="reward-preview"><span>✨</span><div><strong>₹{(Math.max(0, Number(points) || 0) * moneyPerPoint).toFixed(2)} estimated value</strong><small>At ₹{moneyPerPoint.toFixed(2)} per point. You can adjust this rule in a future version.</small></div></div>
            <div className="modal-actions"><button type="button" className="secondary-btn" onClick={() => setShowForm(false)}>Cancel</button><button className="primary-btn" type="submit">Create chore →</button></div>
          </form>
        </div>
      )}
    </div>
  )
}

function ChoreList({ chores, showStatus = false }) {
  if (chores.length === 0) {
    return <div className="empty-state compact"><span>🌱</span><h3>No chores here yet</h3><p>Create a chore to get the family started.</p></div>
  }

  return (
    <div className="chore-list">
      {chores.map(chore => (
        <article className="chore-row" key={chore.id}>
          <span className="chore-emoji">{chore.icon}</span>
          <div className="chore-description"><strong>{chore.title}</strong><small>Assigned to {chore.child}</small></div>
          {showStatus && <span className={`status-pill ${chore.status === 'Approved' ? 'approved' : chore.status === 'Pending review' ? 'pending' : ''}`}>{chore.status}</span>}
          <div className="chore-reward"><strong>⭐ {chore.points}</strong><small>points</small></div>
        </article>
      ))}
    </div>
  )
}

export default App
