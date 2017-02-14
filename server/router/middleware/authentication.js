import jwt from 'jsonwebtoken'
import User from '../../database/models/User'

export default (req, res, next) => {
  const authorizationHeader = req.headers['authorization']
  let token

  if (authorizationHeader) {
    token = authorizationHeader.split(' ')[1]
  }

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          res.status(401).json({error: 'Session has expired'})
          return
        }
        res.status(401).json({error: 'Failed to authenticate'})
      }
      else {
        res.locals.user = {
          id: decoded.id,
          role: decoded.role
        }
        next()
      }
    })
  }
  else {
    res.json({error: 'Failed to authenticate'})
  }
}
