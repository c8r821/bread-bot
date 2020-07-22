import { Client } from '@typeit/discord'
import { config } from 'dotenv'

import storage from './storage'

config()

async function main() {
  const client = new Client({
    classes: [
      `${__dirname}/bread.ts`,
      `${__dirname}/bread.js`
    ],
    silent: false,
    variablesChar: ":"
  })

  await storage.init()
  await client.login(process.env.DISCORD_KEY)

  setTimeout(() => {
    client.user?.setStatus('online')
    client.user?.setActivity({
      name: 'with dough',
      type: 'PLAYING',
    })
  }, 1000)

  const shutdown = async () => {
    console.log('Shutting down...')

    await client.user?.setPresence({
      status: 'invisible',
    })

    client.destroy()
    process.exit()
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}

main()
