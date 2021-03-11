import jwt from 'express-jwt';
import { Request } from 'express';
import config from '@config/index';


const secret = config.secret

function getTokenFromHeader(request: Request) {
  if(!request.headers.authorization) return null;
  const token = request.headers.authorization.split(' ');
  if(token[0] !== 'Ecommerce') return null
  return token[1];
}

const auth ={
  required: jwt({
    secret,
    userProperty: 'headers',
    algorithms:['HS256'],
    //algorithms: ['RS256']
    getToken: getTokenFromHeader,
  }),
  optional: jwt({
    secret,
    userProperty: 'headers',
    credentialsRequired:false,
    algorithms:['HS256'],
    //algorithms: ['RS256']
    getToken: getTokenFromHeader,
  }),
};

export { auth }