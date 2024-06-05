import session from 'express-session';

const sessionOptions: session.SessionOptions = {
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
};

const sessionMiddleware = session(sessionOptions);

export default sessionMiddleware;
