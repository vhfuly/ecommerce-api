import { Request, Response, NextFunction } from 'express';

import User from '@models/User';
import Client from '@models/Client';
import { setPassword } from 'src/utils/password';


class ClientController {

  //ADMIN
  async index(request: Request, response: Response , next: NextFunction) {
    const { store } = request.query;
    const offset = Number(request.query.offset) || 0;
    const limit = Number(request.query.limit) || 30;
    try {
      const clients = await Client.find({store: String(store) })
      .populate({path: 'user', select: "-salt -hash"}).skip(offset).limit(limit);
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
        .populate({path: 'user', select: "-salt -hash"}).skip(offset).limit(limit);
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
      .populate({path: 'user', select: "-salt -hash"});
      response.json(client);
    } catch (error) {
      next(error);
    }
  }

  async updateAdmin(request: Request, response: Response , next: NextFunction) {
    const { name, cpf,  email, phones, address, birthDate} = request.body;
    const { id } = request.params;
    try {
      const client = await Client.findById(id)
        .populate({path: 'user', select: "-salt -hash"});
      const user = await User.findById(client.user)
      if (name) {
        user.name = name;
        client.name = name;
      }
      if (email) user.email = email;
      if (cpf) client.cpf = cpf;
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

  //CLIENT
  async show(request: Request, response: Response , next: NextFunction) {
    const { store } = request.query;
    try {
      const client = await Client.findOne({user: String(request.headers.id), store: String(store) })
        .populate({path: 'user', select: "-salt -hash"});
      response.json(client)
    } catch (error) {
      next(error)
    }
  }

  async store(request: Request, response: Response , next: NextFunction) {
    const { name, cpf,  email, phones, address, birthDate, password } = request.body;
    const { store } = request.query;

    try {
      const user = new User({ name, email, store });
      const { salt, hash } = setPassword(password);
      user.salt = salt;
      user.hash = hash;
      const client = new Client({ name, cpf, phones, address, store, birthDate, user: user._id});
      await user.save();
      await client.save();
      response.json({client: client._doc, email: email});
    } catch (error) {
      next(error)
    }
  }

  async update(request: Request, response: Response , next: NextFunction) {
    const { name, cpf, email, phones, address, birthDate } = request.body;
    const { store } = request.query;
    try {
      const client = await Client.findOne({ user: String(request.headers.id)})
        .populate('user').populate({path: 'user', select: "-salt -hash"});
      if (!client) return response.json({error: 'Client does not exist'})
      const user = await User.findById(client.user)
      if (name) {
        user.name = name;
        client.name = name;
      }
      if (email) user.email = email;
      if (phones) client.phones = phones;
      if (cpf) client.cpf = cpf;
      if (address) client.address = address;
      if (birthDate) client.birthDate =birthDate
      await user.save();
      await client.save();
      response.json(client)
    } catch (error) {
      next(error)
    }
  }

  async remove(request: Request, response: Response , next: NextFunction) {
    try {
      const client = await Client.findOne({user: String(request.headers.id)}).populate('user');
      const user = await User.findById(request.headers.id);
      await user.remove();
      client.deleted = true;
      await client.save();
      response.json({ deleted: true })
    } catch (error) {
      next(error)
    }
  }
}

export { ClientController };