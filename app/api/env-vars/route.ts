import { NextRequest, NextResponse } from 'next/server'

// GET endpoint - returns environment variables
export async function GET(request: NextRequest) {
  try {
    // Only expose specific environment variables for security
    const exposedEnvVars = {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_TELEMETRY_DISABLED: process.env.NEXT_TELEMETRY_DISABLED,
      PROJECT_ID: process.env.PROJECT_ID,
      // Add other non-sensitive environment variables here
      // DO NOT expose sensitive variables like DATABASE_URL, API keys, etc.
    }

    // Filter out undefined values
    const filteredEnvVars = Object.fromEntries(
      Object.entries(exposedEnvVars).filter(([_, value]) => value !== undefined)
    )

    const data = {
      environmentVariables: filteredEnvVars,
      timestamp: new Date().toISOString(),
      method: 'GET'
    }

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
