import { Request, Response, NextFunction } from 'express';

import Product from '@models/Product';
import Variation from '@models/Variation';


class VariationController {
  async index(request: Request, response: Response, next: NextFunction) {
    const { store, product } =request.query;
    try {
      const variations = await Variation.find({ store: String(store), product: String(product) });
      response.json(variations);
    } catch (error) {
      next(error);
    }
  }

  async show(request: Request, response: Response, next: NextFunction) {
    const { store, product } =request.query;
    const { id } =request.params;
    try {
      const variations = await Variation.findOne({ _id: id, store: String(store), product: String(product) });
      response.json(variations);
    } catch (error) {
      next(error);
    }
  }

  async store(request: Request, response: Response, next: NextFunction) {
    const { code, name, price, sale, delivery, amount} = request.body;
    const { store, product } =request.query;
    try {
      const variation = new Variation({ code, name, price, sale, delivery, amount, store, product });
      const _product = await Product.findById(product);
      if (!_product) return response.status(400).json({ error: 'Product not found!'});
      _product.variations.push(variation._id);

      await _product.save();
      await variation.save();
      response.json(variation);
    } catch (error) {
      next(error);
    }
  }


  async update(request: Request, response: Response, next: NextFunction) {
    const { code, availability, name, price, sale, delivery, amount} = request.body;
    const { store, product } =request.query;
    const { id } =request.params;
    try {
      const variation = await Variation.findOne({ _id: id, store: String(store), product: String(product) });
      if (!variation) return response.status(400).json({ error: 'Variation not found!'});

      if (code) variation.code = code;
      if (availability !== undefined) variation.availability = availability;
      if (name) variation.name = name;
      if (price) variation.price = price;
      if (sale) variation.sale = sale;
      if (delivery) variation.delivery = delivery;
      if (amount) variation.code = amount;
      
      await variation.save();
      response.json(variation);
    } catch (error) {
      next(error);
    }
  }

  async updateImages(request: Request, response: Response, next: NextFunction) {
    const { store, product } =request.query;
    const { id } =request.params;
    const files: any = request.files;
    try {
      const variation = await Variation.findOne({ _id: id, store: String(store), product: String(product) });
      if (!variation) return response.status(400).json({ error: 'Variation not found!'});

      const newImages = files.map((item: Express.Multer.File) => item.filename);
      variation.photos = variation.photos.filter((item: string) => item).concat(newImages);

      await variation.save();
      response.json(variation);
    } catch (error) {
      next(error);
    }
  }

  async remove(request: Request, response: Response , next: NextFunction) {
    const { store, product } =request.query;
    const { id } = request.params;
    try {
      const variation = await Variation.findOne({ _id: id, store: String(store), product: String(product) });
      if (!variation) return response.status(400).json({ error: 'Variation not found!'});
  
      const _product = await Product.findById(variation.product);
      if (_product) {
        _product.variations = _product.variations.filter(item => item.toString() !== variation._id.toString());
        await _product.save();
      }
      await variation.remove();
      response.json({ deleted: true });
    } catch (error) {
      next(error);
    }
  }
}


export { VariationController }