import Correios from 'node-correios';
import { config } from '@config/correios';

import { VariationInterface } from '@interfaces/Variation';
import { calcBox } from '../../helpers/calcBox';
import { VariationDocument } from '@models/Variation';
import { ProductDocument } from '@models/Product';

interface Cart {
  variation: VariationDocument;
  product: ProductDocument;
  staticProduct: string;
  amount: number;
  unitPrice: number;
}

const correios = new Correios()

const calculateShipping = async ( zipCode: string, products: Cart[] ) => {
  const _products = products.map(item => ({
    weightKg: item.variation.delivery.weightKg,
    depthCm: item.variation.delivery.dimensions.depthCm,
    heightCm: item.variation.delivery.dimensions.heightCm,
    widthCm: item.variation.delivery.dimensions.widthCm,
    amount: item.amount,
    price: item.unitPrice,
  }));
  const box = calcBox(_products);
  const weightTotal = _products.reduce((all, item) => all + ( item.weightKg * item.amount ) , 0);
  const priceTotal = _products.reduce((all, item) => all + ( item.price * item.amount ) , 0);
  try {
    const results = await Promise.all(
      config.nCdServico.split(',').map(async(service: string)=>{
        const result = await correios.calcPrecoPrazo({
        nCdServico: service,
        sCepOrigem: config.sCepOrigem,
        sCepDestino: zipCode,
        nVlPeso: weightTotal,
        nCdFormato: 1,
        nVlComprimento: box.depth,
        nVlAltura: box.height,
        nVlLargura: box.width,
        nVlDiamentro: 0,
        nVlValorDeclarado: priceTotal < 19.5 ? 19.5 : priceTotal
      });
      return {...result};
    }));
    return results;
  } catch (error) {
    console.log(error)
  }
}

export { calculateShipping }