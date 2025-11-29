import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SubjectPage from './pages/SubjectPage'

function App() {
  return (
    <Router basename="/quickstudy">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/subject/:subjectId" element={<SubjectPage />} />
      </Routes>
    </Router>
  )
}

export default App