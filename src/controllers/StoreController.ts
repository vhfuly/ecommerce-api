import { Request, Response, NextFunction } from 'express';

import Store, { StoreDocument } from '../models/Store';

class StoreController {
  async index(request: Request, response: Response , next: NextFunction) {
    try {
      const stores: StoreDocument[] = await Store.find({}, {_id:1, name: 1, cnpj:1, email:1, phones:1, address: 1 })
      response.json(stores);
    } catch (error) {
      response.json({error: 'No stores found'})
    }
  }

  async show(request: Request, response: Response , next: NextFunction) {
    try {
      const { id } = request.params;
      const store: StoreDocument = await Store.findOne({_id : id}, {_id:1, name: 1, cnpj:1, email:1, phones:1, address: 1 });
      response.json(store);
    } catch (error) {
      response.json({error: 'No store found'})
    }
  }

  async store(request: Request, response: Response , next: NextFunction) {
    try {
      const { name, cnpj, email, phones, address } = request.body;
      const foundCnpj  = await Store.findOne({cnpj});
      if (foundCnpj) return response.status(422).json({error: 'Existing cnpj'});
      const store = new Store({ name, cnpj, email, phones, address });
      await store.save();
      response.json(store);
    } catch (error) {
      response.json({error: 'Error when saving store'})
    }
  }

  async update(request: Request, response: Response , next: NextFunction) {
    try {
      const { name, cnpj, email, phones, address } = request.body;
      const { storeID } = request.query;
      const store: StoreDocument = await Store.findOne({_id: storeID});
      if (!store) return response.status(422).json({error: 'Store does not exist'})
      if (name) store.name = name;
      if (cnpj) store.cnpj = cnpj;
      if (email) store.email = email;
      if (phones) store.phones = phones;
      if (address) store.address = address;
      await store.save()
      response.json(store);
    } catch (error) {
      response.json({error: 'Error when updating data'})
    }
  }

  async remove(request: Request, response: Response , next: NextFunction) {
    try {
      const { storeID } = request.query;
      const store: StoreDocument = await Store.findOne({_id: storeID});
      if (!store) return response.status(422).json({error: 'Store does not exist'})
      await store.remove()
      response.send({ deleted: true });
    } catch (error) {
      response.json({error: 'Error when removing store'})
    }
  }
}

export { StoreController };
