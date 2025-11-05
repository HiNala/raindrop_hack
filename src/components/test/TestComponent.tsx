'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function TestComponent() {
  const [count, setCount] = useState(0)

  return (
    <div className="p-4 border rounded">
      <p>Count: {count}</p>
      <Button onClick={() => setCount(count + 1)}>
        Increment
      </Button>
    </div>
  )
}
