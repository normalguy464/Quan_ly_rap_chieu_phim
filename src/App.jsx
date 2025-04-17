import { useState } from 'react'
import { ToastContainer } from 'react-toastify';

import Test1 from './Components/Test1'
import AllRouter from './Components/AllRouter'
// import CustomHeader from './Components/CustomHeader'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <ToastContainer
                position="top-center"
                autoClose={1500}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
            />
      <AllRouter/>
    </>
  )
}

export default App
