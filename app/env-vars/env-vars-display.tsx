'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

type EnvVars = {
  [key: string]: string | undefined
}

export default function EnvVarsDisplay() {
  const [envVars, setEnvVars] = useState<EnvVars | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEnvVars = async () => {
      try {
        const response = await fetch('/api/env-vars')
        if (!response.ok) {
          throw new Error(`Failed to fetch environment variables: ${response.status}`)
        }
        const data = await response.json()
        setEnvVars(data.environmentVariables)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchEnvVars()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-red-500">
        <CardHeader>
          <CardTitle className="text-red-500">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!envVars) {
    return (
      <Card>
        <CardContent>
          <p>No environment variables found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Server Environment Variables</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {Object.entries(envVars).map(([key, value]) => (
            <div key={key} className="flex flex-col md:flex-row md:items-center md:justify-between p-3 bg-muted rounded-lg">
              <span className="font-mono text-sm font-medium">{key}</span>
              <span className="font-mono text-sm break-all mt-1 md:mt-0 md:ml-4">{value}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-medium text-yellow-800">Security Note</h3>
          <p className="text-sm text-yellow-700 mt-1">
            Only non-sensitive environment variables are exposed to the client for security reasons. 
            Sensitive variables like DATABASE_URL and API keys are never sent to the client.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
