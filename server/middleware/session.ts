import session from 'express-session';

const sessionOptions: session.SessionOptions = {
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: false, maxAge: 1000 * 60 * 60 * 24 },
};

const sessionMiddleware = session(sessionOptions);

export default sessionMiddleware;
