import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';

interface ScoreData {
  atsCompatibility: number;
  keywords: number;
  formatting: number;
  content: number;
  experience: number;
  skills: number;
}

interface ScoreProps {
  shouldFetch: boolean;
  onFetchComplete: () => void;
}

interface AnalysisData {
  filename: string;
  analysis: {
    overallScore: number;
    scores: ScoreData;
    feedback: string[];
    suggestions: string[];
    strengths: string[];
    improvements: string[];
  };
}

function Score({ shouldFetch, onFetchComplete }: ScoreProps) {
  const location = useLocation();

  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (location.state?.analysisData) {
      setData(location.state.analysisData);
      onFetchComplete();
    } else if (shouldFetch) {
      setLoading(true);
      setError("No analysis data available. Please upload a resume first.");
      setLoading(false);
      onFetchComplete();
    }
  }, [shouldFetch, location.state]);

  if (loading) return <div className="text-center mt-20">Loading analysis...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;
  if (!data) return <div className="text-center mt-20">No analysis data available</div>;

  const getColorClass = (s: number) => {
    if (s < 50) return 'text-red-600';
    if (s < 70) return 'text-orange-500';
    return 'text-green-600';
  };

  return (
    <div className="mt-20 px-6 md:px-20 pb-5">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-3xl md:text-4xl font-semibold pb-4">Analysis Result for</h1>
        <h2 className="text-2xl md:text-3xl pb-8 break-words">{data.filename}</h2>
        <div className="flex flex-col items-center">
          <p className="text-xl md:text-2xl pb-4">Overall Score</p>
          <h1 className="text-4xl md:text-5xl text-green-500 font-bold">{data.analysis.overallScore}%</h1>
        </div>
      </div>

      <hr className="my-10" />

      <h1 className="text-2xl md:text-3xl font-semibold mb-6">Category Scores</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 text-base md:text-xl">
        {[
          { label: "ATS Compatibility", score: data.analysis.scores.atsCompatibility },
          { label: "Formatting", score: data.analysis.scores.formatting },
          { label: "Work Experience", score: data.analysis.scores.experience },
          { label: "Skills", score: data.analysis.scores.skills },
          { label: "Content", score: data.analysis.scores.content },
          { label: "Keywords", score: data.analysis.scores.keywords },
        ].map(({ label, score }, i) => (
          <div key={i} className="flex justify-between w-full max-w-md">
            <span>{label}</span>
            <span className={`${getColorClass(score)} font-medium`}>{score}%</span>
          </div>
        ))}
      </div>

      <hr className="my-10" />

      <div className="space-y-8 text-base md:text-lg leading-relaxed">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-blue-800 mb-2">Feedback</h2>
          <ul className="list-disc list-inside text-gray-700">
            {data.analysis.feedback.map((item, index) => (
              <li key={`feedback-${index}`}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-green-800 mb-2">Suggestions</h2>
          <ul className="list-disc list-inside text-gray-700">
            {data.analysis.suggestions.map((item, index) => (
              <li key={`suggestion-${index}`}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-red-700 mb-2">Improvements</h2>
          <ul className="list-disc list-inside text-gray-700">
            {data.analysis.improvements.map((item, index) => (
              <li key={`improvement-${index}`}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Score;
