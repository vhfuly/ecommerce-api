import { Request, Response, NextFunction } from 'express';

import Category from '@models/Category';
import Product, { ProductDocument } from '@models/Product';

class CategoryController {
  async index(request: Request, response: Response , next: NextFunction) {
    const { store } = request.query;
    try {
      const categories = await Category.find({store: String(store) }, { _id: 1, products: 1, name: 1, code: 1, store: 1});
      response.json(categories);
    } catch (error) {
      next(error);
    }
  }

  async indexAvailable(request: Request, response: Response , next: NextFunction) {
    const { store } = request.query;
    try {
      const categories = await Category.find({store: String(store), availability: true}, { _id: 1, products: 1, name: 1, code: 1, store: 1});
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
        .findOne({store: String(store), _id: id}, { _id: 1, products: 1, name: 1, code: 1, store: 1})
        .populate(['products']);
      response.json(category);
    } catch (error) {
      next(error);
    }
  }

  async store(request: Request, response: Response , next: NextFunction) {
    const { store } = request.query;
    const { name, code } = request.body;
    try {
      const category = new Category({name, code , store, availability: true })
      await category.save();
      response.json(category);
    } catch (error) {
      next(error);
    }
  }

  async update(request: Request, response: Response , next: NextFunction) {
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

  async remove(request: Request, response: Response , next: NextFunction) {
    const { id } = request.params
    try {
      const category = Category.findById(id);
      await category.remove();
      response.json({ deleted: true})
    } catch (error) {
      next(error);
    }
  }

  //Products
  async showProducts(request: Request, response: Response , next: NextFunction) {
    const { id } = request.params;
    const offset = Number(request.query.offset) || 0;
    const limit = Number(request.query.limit) || 30;
    try { 
      const product = await Product.find({ category: id })
        .skip(offset).limit(limit);
      response.json(product);
    } catch (error) {
      next(error);
    }
  }

  async updateProducts(request: Request, response: Response , next: NextFunction) {
    const { id } = request.params;
    const { products } = request.body;
    try { 
      const category = await Category.findById(id);
      if (products) category.products = products;
      await category.save();
      let _products = await Product.find({
        $or: [
          { category: id },
          { _id: { $in: products }}
        ]
      });

      _products = await Promise.all(_products.map (async (product: ProductDocument)=>{
          if (!products.includes(String(product._id))) {
            product.category = null;
          } else {
            product.category = id;
          }
          await product.save();
          return product;
      }))
      const product = await Product.find({ category: id })
        .skip(0).limit(30);
      response.json(product);
    } catch (error) {
      next(error);
    }
  }
};

export { CategoryController };