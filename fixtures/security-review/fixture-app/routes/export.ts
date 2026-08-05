import { Router } from 'express'
import { getUserFromBearerToken } from '../lib/auth'
import { db } from '../lib/db'

export const router = Router()

// NOT a planted issue: state-changing route, but authenticated via a
// bearer token read from the Authorization header, not a cookie. A
// cross-site request can't make the browser attach this header, so this
// route is not CSRF-exposed the same way transfer.ts is, even though
// both mutate/produce data. security-review should NOT flag this as a
// CSRF gap — this is the false-positive check for this fixture.
router.post('/export', async (req, res) => {
  const user = getUserFromBearerToken(req)
  const file = await db.generateExport(user.accountId)
  res.json({ url: file.url })
})
