import { Request, Response, NextFunction } from 'express';

import User from '@models/User';
import Client from '@models/Client';
import Purchase from '@models/Purchase';
import { setPassword } from 'src/utils/password';
import Product from '@models/Product';
import Variation from '@models/Variation';


class ClientController {

  //ADMIN
  async index(request: Request, response: Response , next: NextFunction) {
    const { store } = request.query;
    const offset = Number(request.query.offset) || 0;
    const limit = Number(request.query.limit) || 30;
    try {
      const clients = await Client.find({store: String(store) })
      .populate({path: 'user', select: "-salt -hash"}).skip(offset).limit(limit);
      response.json({clients, offset, limit , total:clients.length});
    } catch (error) {
      next(error);
    }
  }

  async searchPurchase(request: Request, response: Response , next: NextFunction) {
    const { store } = request.query;
    const offset = Number(request.query.offset) || 0;
    const limit = Number(request.query.limit) || 30;
    try {
      const search = new RegExp(request.params.search, "i");
      const clients = await Client.find({ store: String(store), name: {$regex: search}});
      let purchases = await Purchase.find({store: String(store), client: { $in: clients.map(item => item._id) }})
      .skip(offset).limit(limit)
      .populate(['client', 'payment', 'delivery']);
      purchases = await Promise.all(purchases.map(async (purchase) => {
        purchase.cart = await Promise.all(purchase.cart.map(async (item) => {
          item.product = await Product.findById(item.product);
          item.variation= await Variation.findById(item.variation);
          return item;
        }));
        return purchase;
      }));
    return response.json({ purchases, offset, limit, total: purchases.length });
    } catch (error) {
      
    }
  }

  async showPurchaseAdmin(request: Request, response: Response , next: NextFunction) {
    const { store } = request.query;
    const { id } = request.params;
    const offset = Number(request.query.offset) || 0;
    const limit = Number(request.query.limit) || 0;
    try {
      const purchases = await Purchase.find({store: String(store), client: id})
        .skip(offset).limit(limit)
        .populate(['client', 'payment', 'delivery', 'variation', 'product']);
      return response.json({ purchases, offset, limit, total: purchases.length });
    } catch (error) {
      next(error);
    }
  }

  async search(request: Request, response: Response , next: NextFunction) {
    const search = new RegExp(request.params.search, 'i');
    const { store } = request.query;
    const offset = Number(request.query.offset) || 0;
    const limit = Number(request.query.limit) || 30;
    try {
      const clients = await Client.find({  store: String(store) , name: { $regex: search }})
        .populate({path: 'user', select: "-salt -hash"}).skip(offset).limit(limit);
      response.json({clients, offset, limit , total:clients.length});
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
      const client = await Client.findOne({user: String(request.payload.id), store: String(store) })
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
      const client = await Client.findOne({ user: String(request.payload.id)})
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
      const client = await Client.findOne({user: String(request.payload.id)}).populate('user');
      const user = await User.findById(request.payload.id);
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