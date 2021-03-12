import { Request, Response, NextFunction } from 'express';

import Store from '@models/Store';
import User from '@models/User';
import Client from '@models/Client';


class ClientController {
  async index(request: Request, response: Response , next: NextFunction) {
    const { store } = request.query;
    const offset = Number(request.query.offset) || 0;
    const limit = Number(request.query.limit) || 30;
    try {
      const clients = await Client.find({store: String(store) })
      .populate('user').skip(offset).limit(limit);
      response.json(clients);
    } catch (error) {
      next(error);
    }
  }

  async searchPurchase(request: Request, response: Response , next: NextFunction) {
    return response.status(400).send({error: 'In development'});
  }

  async showPurchaseAdmin(request: Request, response: Response , next: NextFunction) {
    return response.status(400).send({error: 'In development'});
  }

  async search(request: Request, response: Response , next: NextFunction) {
    const search = new RegExp(request.params.search, 'i');
    const { store } = request.query;
    const offset = Number(request.query.offset) || 0;
    const limit = Number(request.query.limit) || 30;
    try {
      const clients = await Client.find({  store: String(store) , name: { $regex: search }})
        .populate('user').skip(offset).limit(limit);
      response.json(clients);
    } catch (error) {
      next(error);
    }
  }

  async showAdmin(request: Request, response: Response , next: NextFunction) {
    const { id } = request.params;
    const { store } = request.query;
    try {
      const client = await Client.findOne({ store: String(store), _id: id })
        .populate('user');
      response.json(client);
    } catch (error) {
      next(error);
    }
  }

  async updateAdmin(request: Request, response: Response , next: NextFunction) {
    const { name, cpf,  email, phones, address, birthDate} =request.body;
    const { id } = request.params;
    try {
      const client = await Client.findById(id).populate('user')
      const user = await User.findById(client.user)
      if (name) {
        user.name = name;
        client.name = name;
      }
      if (email) user.email = email;
      if (phones) client.phones = phones;
      if (address) client.address = address;
      if (birthDate) client.birthDate =birthDate
      await user.save();
      await client.save();
      response.json(client)
    } catch (error) {
      next(error)
    }
  }
}

export { ClientController };