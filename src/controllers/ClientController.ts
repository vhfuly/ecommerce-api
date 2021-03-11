import { Request, Response, NextFunction } from 'express';

import Store from '@models/Store';
import User from '@models/User';
import Client, { ClientDocument } from '@models/Client';

class ClientController {
  async index(request: Request, response: Response , next: NextFunction) {
    try {
      const { store } = request.query;
      const offset = Number(request.query.offset) || 0;
      const limit = Number(request.query.limit) || 30;

      const clients = await Client.find({$eq: {store: store}})
        .populate({ path: 'User'}).skip(offset).limit(limit);
      response.json(clients);
    } catch (error) {
      next(error);
    }
  }
}
export { ClientController };