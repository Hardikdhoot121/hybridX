import { dashboardData } from '../data/sampleData.js';

const TestOverview = () => {
  const { overview } = dashboardData;
  const physics = overview.subjects.physics || { scored: 0, total: 100 };
  return (
    <main className="page overview-page">
      <h1>Physics Minor Test — Overview</h1>
      <div className="overview-grid">
        <div className="panel score-panel">
          <div className="score-left">
            <p className="muted small">Overall Score</p>
            <div className="score-row">
              <span className="score-main">{overview.overallScore.scored}</span>
              <span className="score-total">/{overview.overallScore.total}</span>
            </div>
            <div className="subject-row">
              <span>Physics Score: {physics.scored}/{physics.total} (only subject in minor test)</span>
            </div>
          </div>
          <div className="score-ghost" />
        </div>
        <div className="panel percentile-panel">
          <p className="muted small">Predicted Percentile</p>
          <div className="score-row">
            <span className="percentile">{overview.percentile}</span>
          </div>
          <p className="muted tiny">Prediction is done based on JEE Main 2025 (22 Jan Shift 2) data</p>
          <div className="score-ghost" />
        </div>
      </div>
      <div className="stats-grid">
        {overview.stats.map((stat) => (
          <div key={stat.key} className="panel stat-card">
            <p className="muted">{stat.label}</p>
            <div className="stat-value">
              {stat.value}
              {stat.total ? <span className="stat-total">/{stat.total}</span> : null}
              {stat.suffix ? <span className="stat-total">{stat.suffix}</span> : null}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default TestOverview;

