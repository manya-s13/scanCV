import {Upload} from 'lucide-react'
import {motion} from 'framer-motion'
import { useRef } from 'react';

function Hero() {

  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
      } catch (err) {
        console.error(err);
        alert("Failed to upload.");
      }
    };

  return (
    <div className='bg-gradient-to-b from-white via-blue-100 to-white min-h-screen w-full overflow-hidden'>
      
        <div className='text-black flex flex-col items-center justify-center py-60'>
            <h1 className='text-7xl text-center pb-10 font-semibold'>See How Your Resume Stands <br /> Before You Apply.</h1>
            <p className='text-2xl text-center text-gray-600'>Get your resume scaned by our AI-powered resume scanner <br /> which provides instant feedback and helps you land more interviews</p>
            <button onClick={handleFileSelect} className='flex items-center gap-4 cursor-pointer mt-20 px-12 py-4 rounded-xl bg-blue-400 text-2xl hover:bg-blue-500 hover:text-white'>
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
            <motion.div
            initial={{opacity: 0, y:50}}
            animate={{opacity: 1, y:0}}
             >
            <div className='flex justify-center text-center gap-40 pt-30'>
          <div className=''>
            <h1 className='text-5xl text-blue-600 font-semibold'>99%</h1>
            <p className='text-xl'>Accuracy</p>
          </div>
          <div>
            <h1 className='text-5xl text-blue-600 font-semibold'>24/7</h1>
            <p className='text-xl'>Analysis</p>
          </div>
        </div>
            </motion.div>
        </div>
    </div>
    
  )
}

export default Hero