import { useState } from "react";

function SeverityBadge({ severity }) {
  const styles = {
    Critical: "bg-red-600 text-white",
    High: "bg-orange-500 text-white",
    Medium: "bg-yellow-400 text-black",
    Low: "bg-green-500 text-white",
  };
  return (
    <span
      className={`px-2 py-1 rounded text-xs font-medium ${styles[severity] || "bg-gray-300 text-black"}`}
    >
      {severity}
    </span>
  );
}

export default function ScanResults({ results, summary, error }) {
  const [copied, setCopied] = useState(null);

  const copy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      alert("Copy failed");
    }
  };

  if (error) {
    return (
      <section className="py-12" id="results">
        <div className="max-w-4xl mx-auto px-4">
          <div className="rounded border border-red-300 bg-red-50 p-4 text-red-600">
            {error}
          </div>
        </div>
      </section>
    );
  }

  if (!results) return null;

  if (results.length === 0) {
    return (
      <section className="py-12" id="results">
        <div className="max-w-4xl mx-auto text-center text-textMuted">
          No findings. Try a deeper scan or test a different target.
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background" id="results" aria-live="polite">
      <div className="max-w-6xl mx-auto px-4">
        {/* Summary Header */}
        {summary && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10">
            <div>
              <h3 className="text-2xl font-semibold text-textPrimary">Findings Summary</h3>
              <p className="text-sm text-textMuted mt-1">
                Total: {summary.total} • Critical: {summary.critical} • High: {summary.high} •
                Medium: {summary.medium} • Low: {summary.low}
              </p>
            </div>
            <div className="text-sm text-textSecondary mt-4 sm:mt-0">
              Scan time: {summary.scanTime}
            </div>
          </div>
        )}

        {/* Findings Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {results.map((f, i) => (
            <article
              key={f.id}
              tabIndex={0}
              className="bg-surface border border-grayBorder rounded-lg shadow-md p-6 hover:shadow-lg transition-all outline-none focus:ring-2 focus:ring-primary"
              style={{
                animation: `slideIn 0.6s ease-out ${i * 0.15}s forwards`,
                opacity: 0,
                transform: "translateY(20px)",
              }}
            >
              {/* Title & Severity */}
              <div className="flex justify-between items-start gap-4 mb-4">
                <div>
                  <h4 className="font-semibold text-lg text-textPrimary">{f.title}</h4>
                  <p className="text-sm text-textSecondary mt-1">{f.description}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <SeverityBadge severity={f.severity} />
                  <button className="text-sm text-primary hover:underline font-medium">
                    View details
                  </button>
                </div>
              </div>

              {/* Endpoint + Actions */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <code className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-textSecondary">
                  {f.endpoint}
                </code>
                <div className="flex gap-2">
                  <button
                    onClick={() => copy(f.samplePayload, f.id)}
                    className="text-xs px-2 py-1 border border-grayBorder rounded text-textSecondary hover:bg-gray-100"
                  >
                    {copied === f.id ? "Copied!" : "Copy payload"}
                  </button>
                  <a
                    className="text-xs px-2 py-1 bg-primary text-white rounded hover:bg-secondary"
                    href={`https://github.com/new?title=${encodeURIComponent(
                      f.title
                    )}&body=${encodeURIComponent(
                      f.description +
                        "\n\nEndpoint: " +
                        f.endpoint +
                        "\n\nSample payload:\n" +
                        f.samplePayload
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Create Issue
                  </a>
                </div>
              </div>

              {/* Payload */}
              <div className="text-xs text-textMuted">
                Sample payload:
                <pre className="font-mono text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                  {f.samplePayload}
                </pre>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Slide-in animation */}
      <style>{`
        @keyframes slideIn {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
