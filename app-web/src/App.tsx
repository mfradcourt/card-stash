import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Welcome to Your React App</h1>

        <Card className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Counter Example</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Current count: <span className="font-bold">{count}</span>
          </p>
          <div className="flex gap-2">
            <Button onClick={() => setCount(count + 1)}>Increment</Button>
            <Button variant="secondary" onClick={() => setCount(count - 1)}>
              Decrement
            </Button>
            <Button variant="destructive" onClick={() => setCount(0)}>
              Reset
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-semibold mb-4">Tech Stack</h2>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
            <li>React with TypeScript</li>
            <li>Tailwind CSS for styling</li>
            <li>shadcn/ui components</li>
            <li>TSLint for linting</li>
            <li>Biome for code formatting</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}

export default App
