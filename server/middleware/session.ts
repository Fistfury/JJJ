import session from 'express-session';

const sessionOptions = {
  secret: 'your_secret_key', 
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } 
};

const sessionMiddleware = session(sessionOptions as session.SessionOptions);

export default sessionMiddleware;
