import express, { json } from 'express';
import morgan from 'morgan';
import {
  errorHandler, errorHandlerConverter, notFoundHandler,
} from '@rcebrian/tfg-rcebrian-common';
import cors from 'cors';
import router from '../api/routes';
import { winstonStream } from './winston.config';

/**
 * Express instance
 * @public
 */
const app = express();

app.use(morgan(':remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms', { stream: winstonStream }));

app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 200,
}));

app.use(json());

app.use('/api', router);

app.use(errorHandlerConverter);

app.use(notFoundHandler);

app.use(errorHandler);

export = app;
