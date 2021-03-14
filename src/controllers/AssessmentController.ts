import { Request, Response, NextFunction } from 'express';

import Assessment from '@models/Assessment';
import Product from '@models/Product';

class CategoryController {

  //client
  async index(request: Request, response: Response , next: NextFunction) {
    const { store, product } = request.query;
    try {
      const assessments = await Assessment.find({store: String(store), product: String(product) });
      response.json(assessments);
    } catch (error) {
      next(error);
    }
  }

  async show(request: Request, response: Response , next: NextFunction) {
    const { store, product } = request.query;
    const { id } = request.params;
    try {
      const assessment = await Assessment.findOne({store: String(store), product: String(product), _id: id });
      response.json(assessment);
    } catch (error) {
      next(error);
    }
  }

  async store(request: Request, response: Response , next: NextFunction) {
    const { store, product } = request.query;
    const { name, text, punctuation } =request.body;
    try {
      const assessment = new Assessment({ name, text, punctuation, store, product });
      const _product = await Product.findById(product);
      if (!_product) return response.json({error: 'Product not found!'});
      _product.assessments.push(assessment._id);

      await _product.save();
      await assessment.save();
      response.json(assessment);
    } catch (error) {
      next(error);
    }
  }

  //ADMIN
  async remove(request: Request, response: Response , next: NextFunction) {
    const { store, product } = request.query;
    const { id } = request.params;
    const { name, text, punctuation } =request.body;
    try {
      const assessment = await Assessment.findById(id);
      const product = await Product.findById(assessment.id);
      if (!product) return response.json({error: 'Product not found!'});
      product.assessments = product.assessments.filter((item) => String(item) !== String(assessment._id));

      await product.save();
      await assessment.remove();
      response.json({deleted: true});
    } catch (error) {
      next(error);
    }
  }
}
export { CategoryController  }