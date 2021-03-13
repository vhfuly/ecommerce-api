import { Request, Response, NextFunction } from 'express';

import Category from '@models/Category';

class CategoryController {
  async index(request: Request, response: Response , next: NextFunction) {
    const { store } = request.query;
    try {
      const categories = await Category.find({store: String(store) }, { _id: 0, products: 1, name: 1, code: 1, store: 1});
      response.json(categories);
    } catch (error) {
      next(error);
    }
  }

  async indexAvailable(request: Request, response: Response , next: NextFunction) {
    const { store } = request.query;
    try {
      const categories = await Category.find({store: String(store), availability: true}, { _id: 0, products: 1, name: 1, code: 1, store: 1});
      response.json(categories);
    } catch (error) {
      next(error);
    }
  }

  async show(request: Request, response: Response , next: NextFunction) {
    const { store } = request.query;
    const { id } = request.params;
    try {
      const category = await Category
        .findOne({store: String(store), _id: id}, { _id: 0, products: 1, name: 1, code: 1, store: 1})
        .populate(['products']);
      response.json(category);
    } catch (error) {
      next(error);
    }
  }

  async store(request: Request, response: Response , next: NextFunction) {
    const { store } = request.query;
    const { name, code } = request.query;
    try {
      const category = new Category({name, code , store, availability: true })
      await category.save();
      response.json(category);
    } catch (error) {
      next(error);
    }
  }

  async update(request: Request, response: Response , next: NextFunction) {
    const { store } = request.query;
    const { id } = request.params
    const { name, code, availability, products } = request.body;
    try {
      const category = await Category.findById(id);
      if (name) category.name = name;
      if (availability !== undefined) category.availability = availability;
      if (code) category.code = code;
      if (products) category.products = products;
      await category.save();
      response.json(category);
    } catch (error) {
      next(error);
    }
  }

  async delete(request: Request, response: Response , next: NextFunction) {
    const { id } = request.params
    try {
      const category = Category.findById(id);
      await category.remove();
      response.json({ deleted: true})
    } catch (error) {
      next(error);
    }
  }
};

export { CategoryController };