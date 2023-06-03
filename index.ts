import { config } from 'dotenv';
config();
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as Routes from './src/routes';
const currentModuleUrl = import.meta.url,
  currentModulePath = dirname(fileURLToPath(currentModuleUrl)),
  { PORT, ENVIRONMENT } = process.env,
  Server = express();

Server.set('trust proxy', true)
  .use(express.urlencoded({ extended: true })) //for x-www-form-urlencoded
  .use(express.json()) //to get data in JSON format
  .use(
    cors({
      origin: '*',
      methods: ['POST', 'GET', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  )
  .use(
    '/avatar',
    express.static(
      join(currentModulePath, '.', 'public', 'uploads', 'user_avatar')
    )
  )
  .use(logRequest)
  .use('/api/auth', Routes.AuthRoute)
  .use('/api/user', Routes.UserRoutes)
  .listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server is listened on PORT:${PORT}`);
    process.on('SIGINT', function () {
      console.log(`Server Stopped!`);
      process.exit(0);
    });
  });

function logRequest(req, res, next) {
  if (ENVIRONMENT == 'dev') {
    let color = '\x1b[37m'; // default to white color
    switch (req.method) {
      case 'GET':
        color = '\x1b[32m'; // green color for GET requests
        break;
      case 'POST':
        color = '\x1b[33m'; // yellow color for POST requests
        break;
      case 'PATCH':
        color = '\x1b[36m'; // cyan color for PUT requests
        break;
      case 'DELETE':
        color = '\x1b[31m'; // red color for DELETE requests
        break;
    }
    console.log(`${color}${req.method}\x1b[0m ${req.url}`);
  }
  next();
}
