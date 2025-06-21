import { useState, useEffect } from "react";
import axios from 'axios';
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

interface ScoreProps {
  shouldFetch: boolean;
  onFetchComplete: () => void;
}

function Score({ shouldFetch, onFetchComplete }: ScoreProps) {
    const location = useLocation();
    
    const [data, setData] = useState<AnalysisData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Check if analysis data was passed from navigation
        if (location.state?.analysisData) {
            setData(location.state.analysisData);
            onFetchComplete();
        } else if (shouldFetch) {
            // Fallback: fetch analysis if no data was passed
            setLoading(true);
            setError("No analysis data available. Please upload a resume first.");
            setLoading(false);
            onFetchComplete();
        }
    }, [shouldFetch, location.state]);

    if (loading) return <div>Loading analysis...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!data) return <div>No analysis data available</div>;

    const getColorClass = (s: number) => {
        if (s < 50) return 'text-red-600';
        if (s < 70) return 'text-orange-500';
        return 'text-green-600';
      };
      

    return (
        <div className="mt-20">
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-4xl font-semibold pb-5">Analysis Result for</h1>
                <h1 className="text-3xl pb-10">{data.filename}</h1>
                <div className="flex flex-col items-center">
                    <p className="text-2xl pb-5">Overall Score</p>
                    <h1 className="text-5xl text-green-500 font-bold"> {data.analysis.overallScore}%</h1>
                </div>
                
            </div>
            <hr className="mx-30 mt-10"></hr>
            <h1 className="text-4xl px-30 py-10  font-semibold">Cateogry Scores</h1>
           
            <div className="grid grid-cols-2 gap-y-6 pl-30 text-xl">
            <div className="flex justify-between w-3/4">
                <span>ATS Compability</span>
                <span className={`${getColorClass(data.analysis.scores.atsCompatibility)} font-medium`}>{data.analysis.scores.atsCompatibility}%</span>
            </div>
            <div className="flex justify-between w-3/4">
                <span>Formatting</span>
                <span className={`${getColorClass(data.analysis.scores.formatting)} font-medium`}>{data.analysis.scores.formatting}%</span>
            </div>

            <div className="flex justify-between w-3/4">
                <span>Work Experience</span>
                <span className={`${getColorClass(data.analysis.scores.experience)} font-medium`}>{data.analysis.scores.experience}%</span>
            </div>
            <div className="flex justify-between w-3/4">
                <span>Skills</span>
                <span className={`${getColorClass(data.analysis.scores.skills)} font-medium`}>{data.analysis.scores.skills}%</span>
            </div>

            <div className="flex justify-between w-3/4">
                <span>Content</span>
                <span className={`${getColorClass(data.analysis.scores.content)} font-medium`}>{data.analysis.scores.formatting}%</span>
            </div>
            <div className="flex justify-between w-3/4">
                <span>KeyWords</span>
                <span className={`${getColorClass(data.analysis.scores.keywords)} font-medium`}>{data.analysis.scores.keywords}%</span>
            </div>
            </div>

            <hr className="mx-30 mt-10"></hr>
            <h1 className="text-4xl px-30 py-10  font-semibold">Feedback</h1>
            
        </div>
    );
}

export default Score;