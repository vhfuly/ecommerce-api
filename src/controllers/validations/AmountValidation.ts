import { Cart } from '@interfaces/Cart';
import Variation from '@models/Variation';

const validateAvailableAmount = async(_cart: Cart[]) => {
  let availableAmount = true;
  try {
    const cart = await Promise.all(_cart.map(async item => {
      item.variation = await Variation.findById(item.variation._id || item.variation);
      return item;
    }));

    cart.forEach( item => {
      if (!item.variation.amount || item.variation.amount < item.amount) {
        availableAmount = false; 
      }
    });
    return availableAmount;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export { validateAvailableAmount }