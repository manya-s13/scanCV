import {Lightbulb, Check, ChartNoAxesCombined} from 'lucide-react'
import {motion} from 'framer-motion'

function Features() {

    const cards = [
        {
            icon: <Lightbulb className='w-10 h-10' />,
            title: "AI Powered Insights",
            desc: "Leverage advanced AI to analyze your resume with smarter feedback"
        },
        {
            icon: <Check className='w-10 h-10'/>,
            title: "ATS Compability",
            desc: "Ensure your resume passes throught ATS"
        },
        {
            icon: <ChartNoAxesCombined className='w-10 h-10' />,
            title: "Quick Analysis",
            desc: "Get immediate analysis and suggestions in seconds"
        },

    ]

  return (
    <div id='Features' className="mb-10">
        <div className="flex flex-col justify-center items-center">
            <h1 className="text-4xl font-semibold pb-4">Make your Resume Stand Out</h1>
            <p className="text-xl text-gray-600">Our AI-powered resume scanner helps you optimize your resume for Applicant Tracking Systems and recruiters.</p>
        </div>
       
        
      
        <div className="grid grid-cols-1 md:grid-cols-3 mt-16 px-24 gap-6">

            {cards.map((card, i)=>(
                 <motion.div
                 initial={{ opacity: 0, y: 40 }}
                 whileInView={{opacity:1 , y: 0}}
                 transition={{ duration: 1, delay: i * 0.2 }}
                 viewport={{ once: true }} >
                <div className="p-10 border border-gray-300 rounded-xl flex flex-col items-start gap-2 hover:scale-105">
                    
                    <h3 className='flex items-center text-2xl text-black font-semibold gap-6' >{card.icon} {card.title}</h3>
                    <p className='text-xl text-gray-500' >{card.desc}</p>
                </div>
                </motion.div>
            ))}
            
        </div>
    </div>
  )
}

export default Features