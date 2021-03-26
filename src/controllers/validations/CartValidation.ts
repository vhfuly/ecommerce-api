import { Cart } from '@interfaces/Cart'
import Product from '@models/Product';
import Variation from '@models/Variation';

const getCartValue = (cart: Cart[]) => {
  let totalPrice = 0;
  let amount= 0;
  cart.forEach(item => {
    totalPrice += item.unitPrice * item.amount;
    amount += item.amount;
  })
  return { totalPrice, amount };
}

const getStoreValue = async(cart: Cart[]) => {
  const results = await Promise.all( cart.map(async (item) =>{
    const product = await Product.findById(item.product);
    const variation = await Variation.findById(item.variation);
    let price = 0;
    let amountVariation = 0;
    if (product && variation && product.variations.includes(variation._id)) {
      let _price = variation.sale || variation.price;
      price = _price * item.amount;
      amountVariation = item.amount
    }
    return {price, amountVariation }
  }));
  let totalPrice = results.reduce((all, item) => all + item.price, 0)
  let amount = results.reduce((all, item) => all + item.amountVariation, 0)
  return { totalPrice, amount };
}

const CartValidation = async(cart: Cart[]) => {
  const { totalPrice: totalPriceCart, amount: totalAmountCart } = getCartValue(cart);
  const { totalPrice: totalPriceStore, amount: totalAmountStore} = await getStoreValue(cart);
  return totalPriceCart === totalPriceStore && totalAmountCart === totalAmountStore;
}

export { CartValidation }