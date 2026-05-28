import { useState } from "react";
import "./App.css";

function App() {
  const [page, setPage] = useState("login");
  const [message, setMessage] = useState("");
  const [studentId, setStudentId] = useState("");
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    branch: "",
    cgpa: "",
    skills: ""
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const handleRegisterChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const registerStudent = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/students/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      setMessage(data.message);

      if (data.student && data.student._id) {
        setStudentId(data.student._id);
        setPage("dashboard");
      }
    } catch {
      setMessage("Error connecting to backend");
    }
  };

  const loginStudent = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/students/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();
      setMessage(data.message);

      if (data.student && data.student.id) {
        setStudentId(data.student.id);
        setPage("dashboard");
      }
    } catch {
      setMessage("Error connecting to backend");
    }
  };

  const viewJobs = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/jobs");
      const data = await response.json();
      setJobs(data);
      setPage("jobs");
    } catch {
      setMessage("Error fetching jobs");
    }
  };

  const applyJob = async (jobId) => {
    try {
      const response = await fetch("http://localhost:5000/api/applications/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, jobId })
      });

      const data = await response.json();
      setMessage(data.message);
    } catch {
      setMessage("Error applying for job");
    }
  };

  const viewApplications = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/applications");
      const data = await response.json();
      setApplications(data);
      setPage("applications");
    } catch {
      setMessage("Error fetching applications");
    }
  };

  const logout = () => {
    setStudentId("");
    setMessage("");
    setPage("login");
  };

  return (
    <div className="app">
      {page === "login" && (
        <div className="auth-page">
          <div className="auth-left">
            <h1>Student Placement Portal</h1>
            <h2>Build Your Career With Confidence</h2>
            <p>Register, login, view jobs, apply for placements and track your application status.</p>
          </div>

          <div className="auth-right">
            <div className="auth-card">
              <h2>Login</h2>

              <input name="email" type="email" placeholder="Enter Email" onChange={handleLoginChange} />

              <div className="password-box">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  onChange={handleLoginChange}
                />
                <span onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>

              <button onClick={loginStudent}>Login</button>

              <p className="switch-text">
                I don't have an account?{" "}
                <span onClick={() => setPage("register")}>Register</span>
              </p>

              {message && <h3>{message}</h3>}
            </div>
          </div>
        </div>
      )}

      {page === "register" && (
        <div className="auth-page">
          <div className="auth-left register-bg">
            <h1>Student Registration</h1>
            <h2>Start Your Placement Journey</h2>
            <p>Create your profile and apply for available job opportunities.</p>
          </div>

          <div className="auth-right">
            <div className="auth-card">
              <h2>Register</h2>

              <input name="name" type="text" placeholder="Full Name" onChange={handleRegisterChange} />
              <input name="email" type="email" placeholder="Email" onChange={handleRegisterChange} />

              <div className="password-box">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  onChange={handleRegisterChange}
                />
                <span onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>

              <input name="branch" type="text" placeholder="Branch" onChange={handleRegisterChange} />
              <input name="cgpa" type="number" placeholder="CGPA" onChange={handleRegisterChange} />
              <input name="skills" type="text" placeholder="Skills" onChange={handleRegisterChange} />

              <button onClick={registerStudent}>Register</button>

              <p className="switch-text">
                Already have an account?{" "}
                <span onClick={() => setPage("login")}>Login</span>
              </p>

              {message && <h3>{message}</h3>}
            </div>
          </div>
        </div>
      )}

      {page === "dashboard" && (
        <div className="dashboard">
          <nav>
            <h2>Placement Portal</h2>
            <button onClick={logout}>Logout</button>
          </nav>

          <h1>Welcome Student</h1>
          <p>Your Student ID: {studentId}</p>

          <div className="dashboard-cards">
            <div className="dash-card" onClick={viewJobs}>
              <h2>View Jobs</h2>
              <p>Check available placement opportunities</p>
            </div>

            <div className="dash-card" onClick={viewApplications}>
              <h2>Applications</h2>
              <p>Track your applied job status</p>
            </div>
          </div>

          {message && <h3>{message}</h3>}
        </div>
      )}

      {page === "jobs" && (
        <div className="dashboard">
          <nav>
            <h2>Available Jobs</h2>
            <button onClick={() => setPage("dashboard")}>Back</button>
          </nav>

          <div className="job-grid">
            {jobs.map((job) => (
              <div className="job-card" key={job._id}>
                <h3>{job.companyName}</h3>
                <p><b>Role:</b> {job.jobTitle}</p>
                <p><b>Package:</b> {job.package}</p>
                <p><b>Eligibility:</b> {job.eligibility}</p>
                <p><b>Skills:</b> {job.skillsRequired}</p>
                <p><b>Last Date:</b> {job.lastDate}</p>
                <button onClick={() => applyJob(job._id)}>Apply</button>
              </div>
            ))}
          </div>

          {message && <h3>{message}</h3>}
        </div>
      )}

      {page === "applications" && (
        <div className="dashboard">
          <nav>
            <h2>Applications</h2>
            <button onClick={() => setPage("dashboard")}>Back</button>
          </nav>

          <div className="job-grid">
            {applications.map((application) => (
              <div className="job-card" key={application._id}>
                <p><b>Student:</b> {application.studentId?.name}</p>
                <p><b>Company:</b> {application.jobId?.companyName}</p>
                <p><b>Role:</b> {application.jobId?.jobTitle}</p>
                <p><b>Status:</b> {application.status}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;