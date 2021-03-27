import { Cart } from '@interfaces/Cart';
import Variation from '@models/Variation';
import { PurchaseInterface } from '@interfaces/Purchase';

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

const updateAmount = async(type: string, purchase: PurchaseInterface) => {
  try {
    const cart = await Promise.all(purchase.cart.map(async item => {
      item.variation = await Variation.findById(item.variation._id || item.variation);
      if (type === 'SavePurchase') {
        item.variation.amount -= item.amount;
        item.variation.blockedAmount += item.amount;
      } else if ( type === 'confirmPurchase') {
        item.variation.blockedAmount -= item.amount;
      } else if ( type === 'canceledPurchase') {
        item.variation.blockedAmount -= item.amount;
        item.variation.amount += item.amount;
      }
      await item.variation.save();
      return item;
    }));
    return true;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export { validateAvailableAmount, updateAmount }