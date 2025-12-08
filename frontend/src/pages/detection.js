import Nav from './nav';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import './detection.css'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { ExclamationCircleIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

const overviewData = [
  { title: "Total URLs Scanned", value: 120, icon: <CheckCircleIcon className="h-6 w-6 text-green-400" /> },
  { title: "Safe URLs", value: 95, icon: <CheckCircleIcon className="h-6 w-6 text-green-400" /> },
  { title: "Phishing URLs", value: 25, icon: <ExclamationCircleIcon className="h-6 w-6 text-red-500" /> },
  { title: "Detection Rate", value: "79%", icon: <CheckCircleIcon className="h-6 w-6 text-blue-400" /> },
];

const pieData = [
  { name: "Safe URLs", value: 95 },
  { name: "Phishing URLs", value: 25 },
];

const pieColors = ["#00ff99", "#ff0066"];

const barData = [
  { day: "Mon", scanned: 20 },
  { day: "Tue", scanned: 15 },
  { day: "Wed", scanned: 25 },
  { day: "Thu", scanned: 30 },
  { day: "Fri", scanned: 10 },
  { day: "Sat", scanned: 20 },
  { day: "Sun", scanned: 15 },
];

const recentScans = [
  { url: "https://example.com", status: "Safe", date: "2025-09-14" },
  { url: "http://phishing-site.com", status: "Phishing", date: "2025-09-13" },
  { url: "https://google.com", status: "Safe", date: "2025-09-12" },
  { url: "http://malicious.net", status: "Phishing", date: "2025-09-12" },
];

const alerts = [
  { message: "Phishing URL detected: http://malicious.net", type: "critical" },
  { message: "New scan completed successfully", type: "info" },
];

function Detection() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'))
    }, [])

    const handleLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Loggedout');
        setTimeout(() => {
            navigate('/login');
        }, 1000)
    }
    
    return (
        <div style={{backgroundColor:'lightblue', height:'100vh', width:'100vw'}}>
            <Nav name={localStorage.getItem('loggedInUser')} handleLogout={handleLogout} />
            <ToastContainer />
            <div className="dashboard" style={{marginTop:'90px'}}>
      <h1 className="neon-text"style={{paddingTop:'15px', marginBottom:'30px'}}>Cyber Dashboard</h1>

      <div className="overview-cards">
        {overviewData.map((item, idx) => (
          <div key={idx} className="card">
            <div className="card-icon">{item.icon}</div>
            <div>
              <p>{item.title}</p>
              <p className="neon-text">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="charts-section">
        <div className="chart-box">
          <h2 className="neon-text">URL Safety Overview</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#111", border: "none", color: "#fff" }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h2 className="neon-text">Scans This Week</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="day" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip contentStyle={{ backgroundColor: "#111", border: "none", color: "#fff" }} />
              <Bar dataKey="scanned" fill="#00ff99" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>


      <div className="alerts-section">
        {alerts.map((alert, idx) => (
          <div key={idx} className={`alert ${alert.type === "critical" ? "alert-critical" : "alert-info"}`}>
            {alert.message}
          </div>
        ))}
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>URL</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentScans.map((scan, idx) => (
              <tr key={idx}>
                <td className={`status-${scan.status.toLowerCase()}`}>{scan.url}</td>
                <td className={`status-${scan.status.toLowerCase()}`}>{scan.status}</td>
                <td>{scan.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
        </div>
    )
}
export default Detection;