import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { dashboardData } from '../data/sampleData.js';

const DppResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dpp = useMemo(() => dashboardData.dpps.find((item) => item.id === id), [id]);

  if (!dpp || !dpp.attempted) {
    return (
      <main className="page">
        <div className="panel">
          <p className="muted">No DPP attempt found.</p>
          <button className="pill-button" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </main>
    );
  }

  const total = dpp.correct + dpp.incorrect;
  return (
    <main className="page overview-page">
      <h1>{dpp.title} — Result</h1>
      <div className="stats-grid">
        <div className="panel stat-card">
          <p className="muted">Correct Questions</p>
          <div className="stat-value">{dpp.correct}</div>
        </div>
        <div className="panel stat-card">
          <p className="muted">Incorrect Questions</p>
          <div className="stat-value">{dpp.incorrect}</div>
        </div>
        <div className="panel stat-card">
          <p className="muted">Accuracy</p>
          <div className="stat-value">
            {dpp.accuracy}
            <span className="stat-total">%</span>
          </div>
        </div>
        <div className="panel stat-card">
          <p className="muted">Total Attempted</p>
          <div className="stat-value">
            {total}
          </div>
        </div>
      </div>
    </main>
  );
};

export default DppResult;