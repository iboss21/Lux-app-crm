import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { env } from './env'
import * as schema from './schema'

// Centralized database connection - no hard crash when DATABASE_URL missing
let db: ReturnType<typeof drizzle<typeof schema>> | null = null

function createDbConnection() {
  if (!env.DATABASE_URL) {
    console.warn('⚠️ DATABASE_URL not set - database operations will fail gracefully')
    return null
  }
  
  try {
    const client = postgres(env.DATABASE_URL, { 
      prepare: false,
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    })
    return drizzle(client, { schema })
  } catch (error) {
    console.error('Failed to create database connection:', error)
    return null
  }
}

// Lazy initialization
export function getDb() {
  if (!db) {
    db = createDbConnection()
  }
  return db
}

// Export for direct use
export { db }
export const initDb = () => {
  db = createDbConnection()
  return db
}

// Re-export schema for convenience
export { schema }
