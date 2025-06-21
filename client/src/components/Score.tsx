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
    
    const [data, setData] = useState<AnalysisData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAnalysis = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.get('http://localhost:3001/api/resume/analyze', {
                withCredentials: true
            });

            if (response.status === 200 && response.data.success) {
                setData(response.data.data);
            } else {
                setError('Failed to fetch analysis data');
            }
        } catch (error) {
            console.error('Error fetching analysis:', error);
            setError('Error fetching analysis data');
        } finally {
            setLoading(false);
            onFetchComplete();
        }
    };

    useEffect(() => {
        if (shouldFetch) {
            fetchAnalysis();
        }
    }, [shouldFetch]);

    if (loading) return <div>Loading analysis...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!data) return <div>No analysis data available</div>;

    return (
        <div>
            <div>
                <h1>Analysis Result for</h1>
                <h1>{data.filename}</h1>
            </div>
            {/* Your JSX for displaying the analysis data */}
        </div>
    );
}

export default Score;