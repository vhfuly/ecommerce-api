import { pagSeguroConfig } from '@config/pagseguro';
import PagSeguro from '../../helpers/ṕagseguro';

import { DeliveryInterface } from '@interfaces/Delivery';
import { PaymentInterface } from '@interfaces/Payment';
import { StoreInterface } from '@interfaces/Store';
import { UserInterface } from '@interfaces/User';
import { Address } from '@interfaces/Client';
import { VariationInterface } from '@interfaces/Variation';
import { ProductInterface } from '@interfaces/Product';

export interface Cart {
  variation: VariationInterface;
  product: ProductInterface;
  staticProduct: string;
  amount: number;
  unitPrice: number;
}

interface ClientInterface {
  user: UserInterface;
  name: string;
  birthDate: Date;
  cpf: string;
  phones: string;
  deleted: boolean;
  store: StoreInterface;
  address: Address;
}

interface Data {
 client: ClientInterface,
 cart: Cart[],
 delivery: DeliveryInterface,
 payment: PaymentInterface,
}

const _createPaymentWithTicket = (senderHash, data: Data) => {
  return new Promise((resolve, reject) => {
    const pag = new PagSeguro(pagSeguroConfig);
    pag.setSender({
      name: data.client.name,
      email: data.client.user.email,
      cpf_cnpj: data.client.cpf.replace(/[-\.]/g, ''),
      area_code: data.client.phones[0].slice(0,2).split(' ').join(''),
      phone: data.client.phones[0].slice(2).trim(),
      birth_date: data.client.birthDate, // formato DD/MM/YYYYY
    });

    pag.setShipping({
      street: data.delivery.address.street,
      number: data.delivery.address.number,
      district: data.delivery.address.district,
      city: data.delivery.address.city,
      state: data.delivery.address.state,
      postal_code: data.delivery.address.zipCode.replace(/-/g, ''),
      same_for_billing: data.payment.sameBillingAddress,
    });

    pag.setBilling({
      street: data.payment.address.street,
      number: data.payment.address.number,
      district: data.payment.address.district,
      city: data.payment.address.city,
      state: data.payment.address.state,
      postal_code: data.payment.address.zipCode.replace(/-/g, ''),
    });

    data.cart.forEach(item => {
      pag.addItem({
        qtde: item.amount,
        value: item.unitPrice,
        description: `${item.product.title} - ${item.variation.name}`,
      });
    });

    pag.addItem({
      qtde: 1,
      value: data.delivery.cost,
      description: 'Custo de Entregas - Correios',
    });

    pag.sendTransaction({
      method: 'boleto',
      value: data.payment.value,
      installments: 1,
      hash: senderHash
    }, (err, data) => (err) ? reject(err) : resolve(data))
  })
}

const _createPaymentWithCard = (senderHash, data: Data) => {
  return new Promise((resolve, reject) => {
    const pag = new PagSeguro(pagSeguroConfig);
    pag.setSender({
      name: data.client.name,
      email: data.client.user.email,
      cpf_cnpj: data.client.cpf.replace(/[-\.]/g, ''),
      area_code: data.client.phones[0].slice(0,2),
      phone: data.client.phones[0].slice(2).trim().split(' ').join(''),
      birth_date: data.client.birthDate, // formato DD/MM/YYYYY
    });

    pag.setShipping({
      street: data.delivery.address.street,
      number: data.delivery.address.number,
      district: data.delivery.address.district,
      city: data.delivery.address.city,
      state: data.delivery.address.state,
      postal_code: data.delivery.address.zipCode.replace(/-/g, ''),
      same_for_billing: data.payment.sameBillingAddress,
    });

    pag.setBilling({
      street: data.payment.address.street,
      number: data.payment.address.number,
      district: data.payment.address.district,
      city: data.payment.address.city,
      state: data.payment.address.state,
      postal_code: data.payment.address.zipCode.replace(/-/g, ''),
    });

    data.cart.forEach(item => {
      pag.addItem({
        qtde: item.amount,
        value: item.unitPrice,
        description: `${item.product.title} - ${item.variation.name}`,
      });
    });

    pag.addItem({
      qtde: 1,
      value: data.delivery.cost,
      description: 'Custo de Entregas - Correios',
    });

    pag.setCreditCardHolder({
      name: data.payment.card.name || data.client.name,
      area_code: data.payment.card.areaCode.trim() || data.client.phones[0].slice(0,2),
      phone: (data.payment.card.phone.trim() || data.client.phones[0].slice(2).trim()).split(' ').join(),
      birth_date: data.payment.card.birthDate || data.client.birthDate,
      cpf_cnpj: (data.payment.card.cpf ||data.client.cpf).replace(/[-\.]/g, ''),
    })

    pag.sendTransaction({
      method: 'creditCart',
      value: (data.payment.value % 2 !== 0 && data.payment.parcel !== 1) ? data.payment.value + 0.01 : data.payment.value,
      installments: data.payment.parcel,
      hash: senderHash,
      credit_card_token: data.payment.card.creditCardToken
    }, (err, data) => (err) ? reject(err) : resolve(data))
  })
}

const createPayment = async(senderHash, data: Data ) => {
  try {
    if (data.payment.type === 'ticket') return await _createPaymentWithTicket(senderHash, data);
    else if ( data.payment.type === "creditCard" ) return await _createPaymentWithCard(senderHash, data);
    else return { errorMessage: "Payment method not found." };
    
  } catch (error) {
    console.log(error);
    return { errorMessage: 'Error', errors: error}
  }
}

const getSessionId = () => {
  return new Promise((resolve, reject) => {
    const pag = new PagSeguro(pagSeguroConfig);
    pag.sessionId((err, session_id) => (err) ? reject(err) : resolve(session_id));
  })
}

const getTransactionStatus = (code: string) => {
  return new Promise((resolve, reject) => {
    const pag = new PagSeguro(pagSeguroConfig);
    pag.transactionStatus(code, (err, session_id) => (err) ? reject(err) :resolve(session_id));
  })
}

const getNotification = (code: string) => {
  return new Promise((resolve, reject) => {
    const pag = new PagSeguro(pagSeguroConfig);
    pag.getNotification(code,(err, session_id) => (err) ? reject(err) :resolve(session_id));
  })
}

export {
  createPayment,
  getSessionId,
  getTransactionStatus,
  getNotification
}