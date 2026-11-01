import React from "react";
import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight, BookOpen, GraduationCap, LayoutDashboard, LogOut, Menu,
  Plus, Search, ShieldCheck, Star, Users, X, PlayCircle, Clock3, Sparkles
} from "lucide-react";
import api, { getErrorMessage } from "./api";

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;
const pickCourse = (data) => data?.course || data;
const pickCourses = (data) => data?.courses || [];

function useSession() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("learnhub-user")); } catch { return null; }
  });
  const save = (next) => {
    setUser(next);
    if (next) localStorage.setItem("learnhub-user", JSON.stringify(next));
    else localStorage.removeItem("learnhub-user");
  };
  return { user, save };
}

function App() {
  const session = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
      session.save(null);
      window.location.assign("/");
    } catch (error) {
      window.alert(getErrorMessage(error));
    }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand" onClick={() => setMobileOpen(false)}>
          <span className="brand-mark"><GraduationCap size={21} /></span>
          <span>learn<span className="brand-accent">hub</span></span>
        </Link>
        <button className="icon-btn mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          {mobileOpen ? <X /> : <Menu />}
        </button>
        <nav className={`nav-links ${mobileOpen ? "nav-open" : ""}`}>
          <NavLink to="/" onClick={() => setMobileOpen(false)}>Explore</NavLink>
          {session.user && <NavLink to="/dashboard" onClick={() => setMobileOpen(false)}>Dashboard</NavLink>}
          {session.user?.role === "teacher" && <NavLink to="/manage" onClick={() => setMobileOpen(false)}>Manage courses</NavLink>}
        </nav>
        <div className="nav-actions">
          {session.user ? (
            <>
              <span className="user-chip"><span className="avatar">{session.user.username?.[0]?.toUpperCase() || "U"}</span>{session.user.username}</span>
              <button className="btn btn-quiet btn-small" onClick={logout}><LogOut size={15} /> Sign out</button>
            </>
          ) : (
            <>
              <Link className="btn btn-quiet btn-small" to="/login">Log in</Link>
              <Link className="btn btn-dark btn-small" to="/register">Get started <ArrowRight size={15} /></Link>
            </>
          )}
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Explore user={session.user} />} />
          <Route path="/login" element={<Auth mode="login" saveUser={session.save} />} />
          <Route path="/register" element={<Auth mode="register" saveUser={session.save} />} />
          <Route path="/dashboard" element={<Dashboard user={session.user} />} />
          <Route path="/manage" element={<Manage user={session.user} />} />
          <Route path="/courses/:id" element={<CourseDetails user={session.user} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="footer">
        <Link to="/" className="brand footer-brand"><span className="brand-mark"><GraduationCap size={18} /></span>learn<span className="brand-accent">hub</span></Link>
        <span>Build a skill. Open a door.</span>
        <span>© {new Date().getFullYear()} Learn Hub</span>
      </footer>
    </div>
  );
}

function Explore({ user }) {
  const [courses, setCourses] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/api/courses/")
      .then(({ data }) => setCourses(pickCourses(data)))
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => ["All", ...new Set(courses.map(c => c.category).filter(Boolean))], [courses]);
  const filtered = courses.filter(c =>
    `${c.title} ${c.description} ${c.instructor} ${c.category}`.toLowerCase().includes(query.toLowerCase()) &&
    (category === "All" || c.category === category)
  );

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> LEARNING, WITHOUT LIMITS</div>
          <h1>Make room for<br /><em>what's next.</em></h1>
          <p className="hero-description">Discover practical courses, learn from people who do the work, and turn curiosity into capability.</p>
          <div className="hero-actions">
            <a href="#courses" className="btn btn-lime">Explore courses <ArrowRight size={17} /></a>
            {!user && <Link to="/register" className="btn btn-outline-light">Join the community</Link>}
          </div>
          <div className="hero-proof"><div className="proof-avatars"><i>A</i><i>M</i><i>J</i></div><span>Small steps. Serious progress.</span></div>
        </div>
        <div className="hero-art">
          <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
          <div className="art-card art-card-main"><div className="art-card-top"><span>YOUR NEXT CHAPTER</span><Sparkles size={17} /></div><div className="art-book"><BookOpen size={44} /></div><h3>Learn something<br />that moves you.</h3><div className="art-progress"><span /></div><div className="art-card-bottom"><span>KEEP GROWING</span><span>01 / ∞</span></div></div>
          <div className="floating-note note-top"><PlayCircle size={16} /> Learn at your pace</div>
          <div className="floating-note note-bottom"><Star size={15} fill="currentColor" /> Skills that stick</div>
        </div>
        <div className="hero-index">01 — DISCOVER</div>
      </section>

      <section className="stats-strip">
        <div><strong>{courses.length.toString().padStart(2, "0")}</strong><span>COURSES TO EXPLORE</span></div>
        <div><strong>01</strong><span>PLACE TO BEGIN</span></div>
        <div><strong>∞</strong><span>WAYS TO GROW</span></div>
      </section>

      <section className="courses-section" id="courses">
        <div className="section-heading">
          <div><div className="eyebrow eyebrow-dark">THE COURSE LIBRARY</div><h2>Find your <em>next skill.</em></h2></div>
          <p>Good learning starts with a single<br />course that catches your attention.</p>
        </div>
        <div className="course-toolbar">
          <div className="search-box"><Search size={18} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search courses, topics, instructors..." /></div>
          <div className="category-list">{categories.map(c => <button key={c} onClick={() => setCategory(c)} className={`category-pill ${category === c ? "active" : ""}`}>{c}</button>)}</div>
        </div>
        {loading ? <div className="state-message">Loading the course library...</div> :
          error ? <div className="state-message error-text">{error}</div> :
          filtered.length ? <div className="course-grid">{filtered.map((course, i) => <CourseCard key={course._id || course.id} course={course} index={i} />)}</div> :
          <div className="empty-state"><BookOpen size={28} /><h3>No courses found</h3><p>Try another search or category.</p></div>}
      </section>
      <section className="bottom-cta"><div><div className="eyebrow">YOUR TURN</div><h2>Curiosity looks<br /><em>good on you.</em></h2></div><Link to={user ? "/dashboard" : "/register"} className="btn btn-lime">Start learning <ArrowRight size={17} /></Link></section>
    </>
  );
}

function CourseCard({ course, index }) {
  const colors = ["card-lime", "card-peach", "card-blue", "card-lavender"];
  return (
    <article className="course-card">
      <Link to={`/courses/${course._id || course.id}`} className={`course-art ${colors[index % colors.length]}`}>
        <span className="course-category">{course.category || "GENERAL"}</span>
        <span className="course-art-icon"><BookOpen size={34} strokeWidth={1.5} /></span>
        <span className="course-art-number">0{(index % 9) + 1}</span>
      </Link>
      <div className="course-card-body">
        <div className="course-meta"><span><GraduationCap size={14} /> {course.instructor || "Learn Hub instructor"}</span><span>{money(course.price)}</span></div>
        <h3><Link to={`/courses/${course._id || course.id}`}>{course.title}</Link></h3>
        <p>{course.description || "A practical course designed to help you build new skills."}</p>
        <Link className="text-link" to={`/courses/${course._id || course.id}`}>View course <ArrowRight size={15} /></Link>
      </div>
    </article>
  );
}

function Auth({ mode, saveUser }) {
  const isRegister = mode === "register";
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "", role: "student" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setError(""); setNotice("");
    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const payload = isRegister ? form : { username: form.username, password: form.password };
      const { data } = await api.post(endpoint, payload);
      if (isRegister) {
        setNotice(data?.message || "Account created. You can now log in.");
      } else {
        saveUser(data.user);
        navigate("/dashboard");
      }
    } catch (e) { setError(getErrorMessage(e)); }
    finally { setBusy(false); }
  };
  return (
    <section className="auth-layout">
      <div className="auth-aside"><div className="eyebrow"><span className="eyebrow-dot" /> LEARN HUB COMMUNITY</div><h1>{isRegister ? <>Start with<br /><em>a curious mind.</em></> : <>Good to see<br /><em>you again.</em></>}</h1><p>{isRegister ? "Create your account and make learning part of your everyday." : "Pick up where you left off. Your next skill is waiting."}</p><div className="auth-aside-mark"><GraduationCap size={90} strokeWidth={0.8} /></div></div>
      <div className="auth-panel"><div className="eyebrow eyebrow-dark">{isRegister ? "CREATE YOUR ACCOUNT" : "WELCOME BACK"}</div><h2>{isRegister ? "Join Learn Hub" : "Log in to Learn Hub"}</h2><p className="muted">{isRegister ? "A few details and you're on your way." : "Enter your details to continue."}</p>
        <form onSubmit={submit} className="form-stack">
          <label>Username<input required minLength={3} value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="e.g. alex" autoComplete="username" /></label>
          <label>Password<input required minLength={6} type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="At least 6 characters" autoComplete={isRegister ? "new-password" : "current-password"} /></label>
          <label>Account type<select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}><option value="student">Student</option><option value="teacher">Teacher</option></select></label>
          {error && <div className="form-alert">{error}</div>}{notice && <div className="form-success">{notice}</div>}
          <button className="btn btn-dark btn-full" disabled={busy}>{busy ? "Please wait..." : isRegister ? "Create account" : "Log in"} <ArrowRight size={16} /></button>
        </form>
        <p className="auth-switch">{isRegister ? "Already have an account?" : "New to Learn Hub?"} <Link to={isRegister ? "/login" : "/register"}>{isRegister ? "Log in" : "Create an account"}</Link></p>
        <p className="auth-security"><ShieldCheck size={15} /> Your password is sent securely to your API over HTTPS in production.</p>
      </div>
    </section>
  );
}

function Dashboard({ user }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const endpoint = user.role === "student" ? "/api/enrollments/my-courses" : "/api/courses/";
    api.get(endpoint).then(({ data }) => setCourses(pickCourses(data)))
      .catch(e => setError(getErrorMessage(e))).finally(() => setLoading(false));
  }, [user]);
  if (!user) return <AccessMessage />;
  return <section className="page-wrap"><div className="page-intro"><div className="eyebrow eyebrow-dark">YOUR LEARNING SPACE</div><h1>Welcome back, <em>{user.username}.</em></h1><p>{user.role === "teacher" ? "Here's what's happening with your course library." : "Your learning journey, all in one place."}</p></div>
    <div className="dashboard-stats"><div><span>{user.role === "teacher" ? "COURSES LISTED" : "COURSES ENROLLED"}</span><strong>{courses.length}</strong></div><div><span>ACCOUNT TYPE</span><strong className="role-value">{user.role}</strong></div><div><span>KEEP GOING</span><strong>→</strong></div></div>
    <div className="section-heading compact"><div><div className="eyebrow eyebrow-dark">{user.role === "teacher" ? "YOUR CATALOGUE" : "YOUR CLASSROOM"}</div><h2>{user.role === "teacher" ? "Your courses" : "Continue learning"}</h2></div>{user.role === "teacher" && <Link className="btn btn-dark" to="/manage"><Plus size={16} /> Add course</Link>}</div>
    {loading ? <div className="state-message">Loading your dashboard...</div> : error ? <div className="state-message error-text">{error}</div> : courses.length ? <div className="course-grid">{courses.map((c, i) => <CourseCard key={c._id || c.id} course={c} index={i} />)}</div> : <div className="empty-state"><BookOpen size={28} /><h3>{user.role === "teacher" ? "Your catalogue is empty" : "Your learning starts here"}</h3><p>{user.role === "teacher" ? "Create your first course and share what you know." : "Explore the library and enrol in a course that interests you."}</p><Link to={user.role === "teacher" ? "/manage" : "/"} className="btn btn-dark">{user.role === "teacher" ? "Create a course" : "Explore courses"} <ArrowRight size={16} /></Link></div>}
  </section>;
}

function Manage({ user }) {
  const [courses, setCourses] = useState([]);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const empty = { title: "", description: "", instructor: user?.username || "", category: "Development", price: 0 };
  const [form, setForm] = useState(empty);
  const load = () => api.get("/api/courses/").then(({ data }) => setCourses(pickCourses(data))).catch(e => setError(getErrorMessage(e)));
  useEffect(() => { if (user?.role === "teacher") load(); }, [user]);
  if (!user) return <AccessMessage />;
  if (user.role !== "teacher") return <div className="page-wrap"><div className="empty-state"><ShieldCheck size={30} /><h3>Teacher access only</h3><p>This area is available to teacher accounts.</p></div></div>;
  const change = (key, value) => setForm(old => ({ ...old, [key]: value }));
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setError("");
    try {
      if (editing) await api.put(`/api/courses/${editing}`, { ...form, price: Number(form.price) });
      else await api.post("/api/courses/", { ...form, price: Number(form.price) });
      setEditing(null); setForm(empty); await load();
    } catch (e) { setError(getErrorMessage(e)); } finally { setBusy(false); }
  };
  const startEdit = (c) => { setEditing(c._id || c.id); setForm({ title: c.title || "", description: c.description || "", instructor: c.instructor || "", category: c.category || "", price: c.price || 0 }); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const remove = async (id) => { if (!window.confirm("Delete this course? This cannot be undone.")) return; try { await api.delete(`/api/courses/${id}`); await load(); } catch (e) { setError(getErrorMessage(e)); } };
  return <section className="page-wrap"><div className="page-intro"><div className="eyebrow eyebrow-dark">TEACHER STUDIO</div><h1>Make knowledge <em>travel.</em></h1><p>Create and maintain the courses you share with learners.</p></div>
    <div className="manage-layout"><form className="manage-form" onSubmit={submit}><div className="eyebrow eyebrow-dark">{editing ? "EDIT COURSE" : "NEW COURSE"}</div><h2>{editing ? "Update your course" : "Create a course"}</h2>
      <label>Course title<input required value={form.title} onChange={e => change("title", e.target.value)} placeholder="Introduction to..." /></label>
      <label>Description<textarea required rows="4" value={form.description} onChange={e => change("description", e.target.value)} placeholder="What will students learn?" /></label>
      <div className="form-two"><label>Instructor<input required value={form.instructor} onChange={e => change("instructor", e.target.value)} /></label><label>Category<input required value={form.category} onChange={e => change("category", e.target.value)} placeholder="Development" /></label></div>
      <label>Price (₹)<input required type="number" min="0" step="1" value={form.price} onChange={e => change("price", e.target.value)} /></label>
      {error && <div className="form-alert">{error}</div>}
      <button className="btn btn-dark btn-full" disabled={busy}>{busy ? "Saving..." : editing ? "Save changes" : "Publish course"} <ArrowRight size={16} /></button>
      {editing && <button type="button" className="btn btn-quiet btn-full" onClick={() => { setEditing(null); setForm(empty); }}>Cancel editing</button>}
    </form>
    <div className="manage-list"><div className="list-heading"><h2>Your courses</h2><span>{courses.length} total</span></div>{courses.map(c => <div className="manage-row" key={c._id || c.id}><div className="mini-course-icon"><BookOpen /></div><div className="manage-row-info"><strong>{c.title}</strong><span>{c.category} · {money(c.price)}</span></div><button className="btn btn-quiet btn-small" onClick={() => startEdit(c)}>Edit</button><button className="btn btn-danger btn-small" onClick={() => remove(c._id || c.id)}>Delete</button></div>)}{!courses.length && <div className="empty-inline">No courses yet. Create your first one.</div>}</div></div>
  </section>;
}

function CourseDetails({ user }) {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const load = () => Promise.all([
    api.get(`/api/courses/${id}`).then(({ data }) => setCourse(pickCourse(data))),
    api.get(`/api/courses/${id}/reviews`).then(({ data }) => setReviews(data?.reviews || []))
  ]).catch(e => setError(getErrorMessage(e)));
  useEffect(() => { load(); }, [id]);
  const enroll = async () => { setBusy(true); setError(""); setMessage(""); try { await api.post(`/api/enrollments/${id}`); setEnrolled(true); setMessage("You're enrolled. Find this course in your dashboard."); } catch (e) { setError(getErrorMessage(e)); } finally { setBusy(false); } };
  const addReview = async (e) => { e.preventDefault(); setBusy(true); setError(""); setMessage(""); try { await api.post(`/api/courses/${id}/reviews`, { rating: Number(rating), comment }); setComment(""); setMessage("Your review has been published."); await load(); } catch (e) { setError(getErrorMessage(e)); } finally { setBusy(false); } };
  if (!course) return <div className="page-wrap state-message">{error || "Loading course..."}</div>;
  return <section className="page-wrap detail-wrap"><Link to="/" className="back-link">← Back to courses</Link><div className="detail-hero"><div><div className="eyebrow eyebrow-dark">{course.category || "LEARN HUB COURSE"}</div><h1>{course.title}</h1><p>{course.description}</p><div className="detail-instructor"><span className="avatar">{(course.instructor || "L")[0]}</span><span>Created by <strong>{course.instructor || "Learn Hub instructor"}</strong></span></div></div><aside className="enroll-card"><span className="price-label">COURSE PRICE</span><strong className="detail-price">{money(course.price)}</strong><span className="muted">One course. A new direction.</span>{user?.role === "student" ? <button className="btn btn-dark btn-full" onClick={enroll} disabled={busy || enrolled}>{enrolled ? "Enrolled" : busy ? "Please wait..." : "Enroll now"} <ArrowRight size={16} /></button> : !user ? <Link className="btn btn-dark btn-full" to="/login">Log in to enroll <ArrowRight size={16} /></Link> : <span className="muted">Teacher account</span>}</aside></div>
    {message && <div className="form-success">{message}</div>}{error && <div className="form-alert">{error}</div>}
    <div className="reviews-section"><div className="section-heading compact"><div><div className="eyebrow eyebrow-dark">LEARNER FEEDBACK</div><h2>Course <em>reviews.</em></h2></div><span className="review-count">{reviews.length} reviews</span></div>
      {user?.role === "student" && <form className="review-form" onSubmit={addReview}><h3>Share your experience</h3><label>Rating<select value={rating} onChange={e => setRating(e.target.value)}>{[5,4,3,2,1].map(n => <option key={n} value={n}>{n} / 5</option>)}</select></label><label>Your review<textarea required rows="3" value={comment} onChange={e => setComment(e.target.value)} placeholder="What did you think of this course?" /></label><button className="btn btn-dark" disabled={busy}>Publish review <ArrowRight size={15} /></button><small className="muted">You must be enrolled to review this course.</small></form>}
      {reviews.length ? <div className="reviews-grid">{reviews.map((r, i) => <article className="review-card" key={r._id || r.id || i}><div className="review-stars">{Array.from({ length: Number(r.rating || 0) }, (_, j) => <Star key={j} size={14} fill="currentColor" />)}</div><p>{r.comment}</p><span>{r.student || "Student"}</span></article>)}</div> : <div className="empty-inline">No reviews yet. Be the first to share your experience after enrolling.</div>}
    </div>
  </section>;
}

function AccessMessage() {
  return <div className="page-wrap"><div className="empty-state"><ShieldCheck size={30} /><h3>Log in to continue</h3><p>You need an account to access this page.</p><Link className="btn btn-dark" to="/login">Log in <ArrowRight size={16} /></Link></div></div>;
}
function NotFound() { return <div className="page-wrap"><div className="empty-state"><h2>Page not found</h2><Link className="btn btn-dark" to="/">Back to Learn Hub</Link></div></div>; }

export default App;
