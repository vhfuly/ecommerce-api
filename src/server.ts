import compression from 'compression';
import express, { Request, Response, NextFunction } from 'express';
import ejs from 'ejs';
import bodyParser from 'body-parser';
import mongoose, { Error } from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';

import { AppError } from './errors/AppError';

const app = express();
app.use(express.json());

const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

app.use('/public', express.static(__dirname + '/public'));
app.use('/public/images', express.static(__dirname + '/public/images'));

// mongoose.connect(process.env.DB_URI, { useNewUrlParser: true });

app.set('view engine', 'ejs')

if(!isProduction) app.use(morgan('dev'));
app.use(cors());
app.disable('x-powered-by');
app.use(compression());

app.use(bodyParser.urlencoded({ extended: false, limit: 1.5*1024*1024 }));
app.use(bodyParser.json({ limit: 1.5*1024*1024 }));


app.use((err: Error, request:Request, response: Response, _next: NextFunction) => {
  if(err instanceof AppError) {
    return response.status(err.statusCode).json({
      message: err.message
    })
  }

  return response.status(500).json({
    status: "Error",
    message: `Internal server error ${err.message}`,
  })
});

app.listen(PORT, () => {
    console.log(`Server is running in //localhost:${PORT}`);
});
