import { Upload } from "lucide-react"
import { useRef, useState } from "react"
import Score from "./Score";
import { useNavigate } from "react-router-dom";


function DropCV() {
const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [analysisStarted, setAnalysisStarted] = useState(false);

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

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch("http://localhost:3001/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      alert(data.message || "Upload successful!");

      const analysisRes = await fetch("http://localhost:3001/api/resume/analyze", {
        method: "POST",
        credentials: "include"
      });
      const analysisData = await analysisRes.json();
      
      if (analysisData.success) {
        // store analysis somewhere (optional)
        navigate('/analyze', { state: { analysisData } });

      } else {
        alert("Analysis failed. Try again.");
      }

    } catch (err) {
      console.error(err);
      alert("Failed to upload.");
    }
  };

  const handleFetchComplete = () => {
    setShouldFetch(false); // stop further fetching
  };
  
  return (
    <div id="Drop" className='mt-40 mb-10'>
        <div className='flex flex-col items-center justify-center'>
            <h1 className='text-black text-4xl mb-5 font-semibold'>Upload Your Resume</h1>
            <p className="text-lg text-gray-600">Upload PDF format of your resume</p>
            <div className="flex flex-col items-center justify-center mt-20 border border-dashed rounded-xl border-gray-500 w-150 h-100 hover:bg-blue-100">
              <Upload className="w-10 h-10" />
              <button onClick={handleFileSelect}
               className="mt-10 rounded-xl px-10 py-4 border text-2xl border-black hover:bg-blue-500 cursor-pointer">
                Browse files</button>
                <input
                type="file"
                accept="application/pdf"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
           
        </div>
        <div className="mt-10">
        {analysisStarted && (
          <Score shouldFetch={shouldFetch} onFetchComplete={handleFetchComplete} />
        )}
      </div>
    </div>
  )
}

export default DropCV