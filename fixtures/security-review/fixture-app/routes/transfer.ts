import { Router } from 'express'
import { getUserFromSession } from '../lib/session'
import { db } from '../lib/db'

export const router = Router()

// PLANTED ISSUE 1: state-changing route, cookie-session auth, no CSRF
// token check anywhere in this handler. A cross-site form POST would
// carry the session cookie automatically and this would execute.
router.post('/transfer', async (req, res) => {
  const user = getUserFromSession(req)
  const { toAccount, amount } = req.body
  await db.transfer(user.accountId, toAccount, amount)
  res.json({ ok: true })
})
