import {Upload} from 'lucide-react'
import {motion} from 'framer-motion'
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Hero() {

  
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };


  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      return;
    }

    setIsAnalyzing(true);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      // const res = await fetch(`${process.env.REACT_APP_API_URL}/api/resume/analyze`, {
      //   method: "POST",
      //   body: formData,
      // });

      // alert(data.message || "Upload successful!");

      const analysisRes = await fetch('https://scancv.onrender.com/api/resume/analyze', {
        method: "POST",
        body: formData,
      });
      const analysisData = await analysisRes.json();
      
      if (analysisData.success) {
        // Navigate to analysis page with the data
        navigate('/analyze', { state: { analysisData: analysisData.data } });
      } else {
        alert("Failed to analyze resume.");
        setIsAnalyzing(false);
      }

    } catch (err) {
      console.error(err);
      alert("Failed to analyze resume.");
      setIsAnalyzing(false);
    }
  };
    
  return (
    <div className='bg-gradient-to-b from-white via-blue-100 to-white min-h-screen w-full overflow-hidden'>
      
        <div className='text-black flex flex-col items-center justify-center py-40'>
            <h1 className='text-4xl md:text-5xl text-center text-blue-500 font-semibold'>AI Resume Scanner</h1>
            <h1 className='text-4xl md:text-5xl text-center pb-10 font-semibold'>that actually gets you hired</h1>
            <p className='text-lg md:text-2xl text-center text-gray-600'>Get your resume scaned by our AI-powered resume scanner <br /> which provides instant feedback and helps you land more interviews</p>
            <button onClick={handleFileSelect} className='flex items-center gap-4 cursor-pointer mt-20 px-6 py-4 rounded-xl bg-blue-400 text-xl hover:bg-blue-500 hover:text-white'>
              <Upload />
                Upload Resume
            </button>
            <input
            type="file"
            accept="application/pdf"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="mt-10">
        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-4"></div>
            <h2 className="text-2xl font-semibold text-gray-700">Analyzing Resume...</h2>
            <p className="text-gray-500 mt-2">Please wait while our AI analyzes your resume</p>
          </div>
        )}
      </div>
        </div>
    </div>
    
  )
}

export default Hero