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
      const store: StoreDocument = await Store.findById({id}, {_id:1, name: 1, cnpj:1, email:1, phones:1, address: 1 })
      response.json(store);
    } catch (error) {
      response.json({error: 'No store found'})
    }
  }

  async store(request: Request, response: Response , next: NextFunction) {
    try {
      const { name, cnpj, email, phones, address } = request.body;
      const error = [];
      if (!name) error.push('name');
      if (!cnpj) error.push('cnpj');
      if (!email) error.push('email');
      if (!phones) error.push('phones');
      if (!address) error.push('address');
      if (!error?.length) return response.status(422).json({error: 'required', payload: error});
      const store = new Store({ name, cnpj, email, phones, address });
      store.save()
      response.json(store);
    } catch (error) {
      response.json({error: 'Error when saving store'})
    }
  }

  async update(request: Request, response: Response , next: NextFunction) {
    try {
      const { name, cnpj, email, phones, address } = request.body;
      const { id } = request.params;
      const store: StoreDocument = await Store.findById({id});
      if (!store) return response.status(422).json({error: 'Store does not exist'})
      if (name) store.name = name;
      if (cnpj) store.cnpj = cnpj;
      if (email) store.email = email;
      if (phones) store.phones = phones;
      if (address) store.address = address;
      store.save()
      response.json(store);
    } catch (error) {
      response.json({error: 'Error when updating data'})
    }
  }

  async remove(request: Request, response: Response , next: NextFunction) {
    try {
      const { id } = request.params;
      const store: StoreDocument = await Store.findById({id});
      if (!store) return response.status(422).json({error: 'Store does not exist'})
      store.remove()
      response.send({ deleted: true });
    } catch (error) {
      response.json({error: 'Error when removing store'})
    }
  }
}

export { StoreController };
