/* eslint-disable react/prop-types */
const Loading = ({ darkMode }) => {
  return (
    <div className='flex flex-col items-center justify-center mt-48 gap-4'>
        <div className='flex gap-2'>
          <span className='loading loading-bars loading-xs text-orange-500'></span>
          <span className='loading loading-bars loading-sm text-teal-500'></span>
          <span className='loading loading-bars loading-md text-sky-500'></span>
          <span className='loading loading-bars loading-lg text-fuchsia-500'></span>
        </div>
        <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Loading your music...
        </p>
    </div>
  )
}

export default Loading