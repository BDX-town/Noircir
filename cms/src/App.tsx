import { useState } from 'react'

import { AppContextProvider } from './data/AppContext';
import { Block, Button } from '@bdxtown/canaille';

function App() {
  const [count, setCount] = useState(0)

  return (
    <AppContextProvider>
      <Block>
        <h1 className='text-3xl font-bold underline bg-brand-primary'>Vite + React</h1>
          <Button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </Button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </Block>
    </AppContextProvider>
  )
}

export default App
