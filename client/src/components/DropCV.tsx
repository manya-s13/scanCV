import { Upload } from "lucide-react"
import { useRef } from "react"

function DropCV() {

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
      const res = await fetch("http://localhost:5000/upload", {
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
    </div>
  )
}

export default DropCV