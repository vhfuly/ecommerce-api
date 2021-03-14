import { Request, Response, NextFunction } from 'express';

import Category from '@models/Category';
import Product from '@models/Product';
import Assessment from '@models/Assessment';

const getSort = (sortType: string) => {
  switch(sortType) {
    case 'alphabetic_a-z':
      return { title: 1 };
    case 'alphabetic_z-a':
      return { title: -1 };
    case 'price_low–high':
      return { price: 1 };
    case 'price_high–low':
      return { price: -1 };
    default: 
      return {};
  }
}

class ProductController {
  //ADMIN
  async store(request: Request, response: Response , next: NextFunction) {
    const { title, description, category: categoryId , price, sale, sku } = request.body;
    const { store } = request.query;
    try {
      const product = new Product({
        title,
        availability: true,
        description,
        category: categoryId,
        price,
        sale,
        sku,
        store,
      });

      const category = await Category.findById(categoryId);
      if (!category) return response.status(400).json({ error: 'Category not found'});
      category.products.push(product._id);

      await product.save();
      await category.save();

      response.json(product);
      
    } catch (error) {
      next(error);
    }
  }

  async update(request: Request, response: Response , next: NextFunction) {
    const { title, description, availability, category , price, sale, sku } = request.body;
    const { store } = request.query;
    const { id } = request.params;
    try {
      const product = await Product.findById(id);
      if (!product) return response.status(400).json({ error: 'Product not found'});

      if (title) product.title = title;
      if (description) product.description = description;
      if (availability !== undefined) product.availability = availability;
      if (price) product.price = price
      if (sale) product.sale = sale;
      if (sku) product.sku = sku;

      if( category && category.toString() !== product.category.toString() ){
        const oldCategory = await Category.findById(product.category);
        const newCategory = await Category.findById(category);

        if(oldCategory && newCategory){
          oldCategory.products = oldCategory.products.filter(item => item.toString() !== product._id.toString());
          newCategory.products.push(product._id);
          product.category = category;
          await oldCategory.save();
          await newCategory.save();
        } else if(newCategory){
          newCategory.products.push(product._id);
          product.category = category;
          await newCategory.save();
        }
      }
      await product.save();
      response.json(product);
    } catch (error) {
    next(error)
    }
  }

  async images(request: Request, response: Response , next: NextFunction) {
    console.log(typeof request.files)
  }

  async updateImages(request: Request, response: Response , next: NextFunction) {
    const { store } = request.query;
    const { id } = request.params;
    const files: any = request.files;
    try {
      const product = await Product.findOne({ _id: id, store: String(store) });
      if(!product) return response.status(400).json({ error: 'Product not found'});
      console.log(request.files)
      const newImages = files.map((item: Express.Multer.File) => item.filename);
      product.photos = product.photos.filter((item: string) => item).concat(newImages);

      await product.save();

      return response.json(product);
    } catch (error) {
      next(error)
    }
  }

  async remove(request: Request, response: Response , next: NextFunction) {
    const { store } =request.query;
    const { id } = request.params;
    try {
      const product = await Product.findOne({ _id: id, store: String(store) });
      if(!product) return response.status(400).json({ error: 'Product not found'});

      const category = await Category.findById(product.category);
      if (category) {
        category.products = category.products.filter(item => item.toString() !== product._id.toString());
        await category.save();
      }
      await product.remove();
      response.json({ deleted: true });
    } catch (error) {
      next(error);
    }
  }

  //CLIENT
  async index(request: Request, response: Response , next: NextFunction) {
    const { store, sortType } = request.query;
    const offset = Number(request.query.offset) || 0;
    const limit = Number(request.query.limit) || 30;
    try {
      const product = await Product.find({store: String(store) })
       .skip(offset).limit(limit).sort(getSort(String(sortType)));
      response.json({product, offset, limit, total: product.length });
    } catch (error) {
      next(error)
    }
  }

  async indexAvailable(request: Request, response: Response , next: NextFunction) {
    const { store, sortType } = request.query;
    const offset = Number(request.query.offset) || 0;
    const limit = Number(request.query.limit) || 30;
    try {
      const product = await Product.find({store: String(store), availability: true })
       .skip(offset).limit(limit).sort(getSort(String(sortType)));
      response.json({product, offset, limit, total: product.length });
    } catch (error) {
      next(error)
    }
  }

  async search(request: Request, response: Response , next: NextFunction) {
    const { store, sortType } = request.query;
    const offset = Number(request.query.offset) || 0;
    const limit = Number(request.query.limit) || 30;
    const search = new RegExp(request.params.search, 'i');
    try {
      const product = await Product.find({
        store: String(store),
        $or:[
          { title: { $regex:search }},
          { description: { $regex:search }},
          { sku: { $regex:search }},
        ],
      })
       .skip(offset).limit(limit).sort(getSort(String(sortType)));
      response.json({product, offset, limit, total: product.length });
    } catch (error) {
      next(error)
    }
  }

  async show(request: Request, response: Response , next: NextFunction) {
    const { id } = request.params;
    try {
      const product = await Product.findById(id)
       .populate(['store', 'assessments', 'variations']);
      response.json(product);
    } catch (error) {
      next(error)
    }
  }

  //Assessments
  async showAssessments(request: Request, response: Response , next: NextFunction) {
    const { id } = request.params;
    try {
      const assessments = await Assessment.find({product: id});
      response.json(assessments);
    } catch (error) {
      next(error)
    }
  }

}

export { ProductController }