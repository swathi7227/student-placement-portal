import { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    branch: "",
    cgpa: "",
    skills: ""
  });

  const [message, setMessage] = useState("");
  const [jobs, setJobs] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [applications, setApplications] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const registerStudent = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/students/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      setMessage(data.message);

      if (data.student && data.student._id) {
        setStudentId(data.student._id);
      }
    } catch (error) {
      setMessage("Error connecting to backend");
    }
  };

  const viewJobs = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/jobs");
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      setMessage("Error fetching jobs");
    }
  };

  const applyJob = async (jobId) => {
    if (!studentId) {
      setMessage("Please enter or register student ID first");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/applications/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          studentId: studentId,
          jobId: jobId
        })
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("Error applying for job");
    }
  };

  const viewApplications = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/applications");
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      setMessage("Error fetching applications");
    }
  };

  return (
    <div className="app">
      <h1>Student Placement Portal</h1>
      <p>Register students, view jobs, apply, and track applications</p>

      <div className="form-box">
        <h2>Student Registration</h2>

        <input name="name" type="text" placeholder="Full Name" onChange={handleChange} />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} />

        <div className="password-box">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={handleChange}
          />
          <span onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <input name="branch" type="text" placeholder="Branch" onChange={handleChange} />
        <input name="cgpa" type="number" placeholder="CGPA" onChange={handleChange} />
        <input name="skills" type="text" placeholder="Skills" onChange={handleChange} />

        <button onClick={registerStudent}>Register</button>

        {studentId && <p><b>Your Student ID:</b> {studentId}</p>}
      </div>

      <div className="form-box">
        <h2>Apply for Jobs</h2>

        <input
          type="text"
          placeholder="Enter Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />

        <button onClick={viewJobs}>View Jobs</button>

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

        {message && <h3>{message}</h3>}
      </div>

      <div className="form-box">
        <h2>Applications</h2>
        <button onClick={viewApplications}>View Applications</button>

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
  );
}

export default App;