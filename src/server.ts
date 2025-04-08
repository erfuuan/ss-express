import express, { Application, Request, Response } from 'express';
import path from 'path';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

const app: Application = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

// SSE Endpoint
app.get('/events', (req: Request, res: Response): void => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Function to send a message
  const sendEvent = (): void => {
    const message = `Current time: ${new Date().toLocaleTimeString()}`;
    res.write(`data: ${message}\n\n`);
  };

  // Send a message every 5 seconds
  const intervalId = setInterval(sendEvent, 5000);

  // Send an initial message
  sendEvent();

  // Clean up when the client disconnects
  req.on('close', () => {
    clearInterval(intervalId);
    res.end();
  });
});


app.listen(3000, () => {
  console.log('App started on port 3000');
});
