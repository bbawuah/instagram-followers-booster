import dotenv from 'dotenv'
dotenv.config()
import { accounts, PORT } from './config/constants'
import { IgApiClient } from 'instagram-private-api'
import express from 'express'

const app = express()
app.use(express.json())

const IG = new IgApiClient()

if (process.env.USERNAME && process.env.PASSWORD) {
  IG.state.generateDevice(process.env.USERNAME)
  console.log(process.env.USERNAME)
}

async function login() {
  await IG.simulate.preLoginFlow()
  if (process.env.USERNAME && process.env.PASSWORD) {
    await IG.account.login(process.env.USERNAME, process.env.PASSWORD)
  }
}

function reFollow() {
  accounts.forEach(async (account) => {
    const userId = await IG.user.getIdByUsername(account)
    await IG.friendship.destroy(userId)
    IG.friendship.create(userId)
  })
}

login().then(() => {
  reFollow()
  setInterval(() => {
    reFollow()
  }, 3600000)
})

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
