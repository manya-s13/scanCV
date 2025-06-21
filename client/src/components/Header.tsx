'use client'

function Header() {

    const scrollToSection = (sectionId: string):void => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      };
    
  return (
    <div className='sticky top-0 backdrop-blur-xl  text-black pt-9 overflow-hidden pb-3'>
        <div className='flex flex-row justify-around items-center'>
            <span className='text-3xl font-semibold'>scanCV</span>
            <div className='text-xl flex flex-row justify-end gap-10 items-center'>
                <a href="/" className='hover:text-blue-500 cursor-pointer'>Home</a>
                <a onClick={()=> scrollToSection('Features')} className='hover:text-blue-500 cursor-pointer'>Why Us?</a>
                <button onClick={()=>scrollToSection('Drop')} className='bg-blue-400 text-xl rounded-lg px-5 py-3 cursor-pointer hover:bg-blue-500 hover:text-white'>scan resume</button>
            </div>
            
        </div>
    </div>
  )
}

export default Header