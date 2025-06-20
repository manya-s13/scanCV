import { Github, Linkedin, Twitter } from 'lucide-react'


function Footer() {
  return (
    <div className='mt-10 pb-5 bg-gray-100 overflow-hidden'>
        <div className='flex'>
            <div className='flex flex-col p-20'>
                <h1 className='text-3xl font-semibold text-black pb-5'>ScanCV</h1>
                <p className='text-xl text-gray-600'>AI-Powered Resume Scanner to help you enhance your resume</p>
            </div>
            <div className='flex gap-8 p-20 pl-200'>
            <Linkedin className='w-10 h-10 hover:text-blue-600 cursor-pointer' />
            <Github className='w-10 h-10 hover:text-blue-600 cursor-pointer' />
            <Twitter className='w-10 h-10 hover:text-blue-600 cursor-pointer' />
            
            </div>   
        </div>
        <div className='border-t px-20 border-gray-300 pt-4 flex flex-col lg:flex-row justify-between items-center text-xl text-gray-600'>
        <p>© 2025 ScanCV. All rights reserved.</p>
        <div className='flex gap-6 mt-2 lg:mt-0'>
          <a href='#' className='hover:underline'>Privacy</a>
          <a href='#' className='hover:underline'>Terms</a>
          <a href='#' className='hover:underline'>Cookies</a>
        </div>
      </div>
    </div>
  )
}

export default Footer