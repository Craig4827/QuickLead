const allowedDomains = ['hbr.org', 'medium.com', 'sciencedirect.com'];

function isAllowedUrl(url) {
  try {
    const domain = new URL(url).hostname;
    return allowedDomains.some(allowed => domain.includes(allowed));
  } catch {
    return false;
  }
}

export default function ResultsSection({ query, summary, resources }) {
  return (
    <section className="results-section">
      <h2>Results for: {query}</h2>
      <p>{summary}</p>
      <ul>
        {resources.map((resource, idx) => (
          <li key={idx} className="resource-item">
            <strong>{resource.title}</strong> ({resource.type}, {resource.source})<br />
            {isAllowedUrl(resource.url) ? (
              <a href={resource.url} target="_blank" rel="noopener noreferrer" className="read-more-btn">Read More</a>
            ) : (
              <span style={{ color: 'gray' }}>Link blocked or unavailable</span>
            )}
            {resource.guidance && (<div className="guidance">{resource.guidance}</div>)}
          </li>
        ))}
      </ul>
    </section>
  );
}
