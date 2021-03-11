import compression from 'compression';
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import { ValidationError } from 'express-validation';
import { router } from './routes';
import { dbs } from '@config/database';

const app = express();
app.use(express.json());

const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

app.use('/public', express.static(`${__dirname}src/public`));
app.use('/public/images', express.static(`${__dirname}src/public/images`));

const dbURI = isProduction ? dbs.dbProduction : dbs.dbTest;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => console.log('connection successful'))
  .catch((err) => console.error(err));

app.set('view engine', 'ejs');

if (!isProduction) app.use(morgan('dev'));
app.use(cors());
app.disable('x-powered-by');
app.use(compression());

app.use(bodyParser.urlencoded({ extended: false, limit: 1.5 * 1024 * 1024 }));
app.use(bodyParser.json({ limit: 1.5 * 1024 * 1024 }));

app.use('/', router);

app.use((err: ValidationError, request:Request, response: Response, _next: NextFunction) => {
  response.status(err.statusCode || 500);
  if (err.statusCode !== 404) console.warn('Error: ', err, new Date());
  response.json(err);
});

export { app, PORT }
