import transporter from 'nodemailer'
import createTransport from '../config/email';
import config from '../config/index';
import { format } from 'date-fns';
import { UserInterface } from '@interfaces/User';
import { PurchaseInterface } from '@interfaces/Purchase';

const link = config.store;

let mail = transporter.createTransport(createTransport)

const send = ( subject: string, emails: string, message: string, cb = null) => {
  const mailOptions = {
    from: 'no-response@loja.com',
    to: emails,
    subject,
    html: message
  };

  if( process.env.NODE_ENV === "production" ){
    mail.sendMail(mailOptions, function(error, info){
      if(error){
        console.warn(error);
        if(cb) return cb(error);
      } else {
        if(cb) return cb(null, true);
      }
    });
  } else {
    console.log(mailOptions);
    if(cb) return cb(null, true);
  }
};

// NOVO PEDIDO
const submitNewPurchase = (user: UserInterface, purchase: PurchaseInterface ) => {
  const message = `
      <h1 style="text-align:center;">Pedido Recebido</h1>
      <br />
      <p>O pedido realizado hoje, no dia ${format(purchase.createdAt, 'dd/MM/yyyy')}, foi recebido com sucesso.</p>
      <br />
      <a href="${link}">Acesse a loja para saber mais.</a>
      <br /><br />
      <p>Atenciosamente,</p>
      <p>Equipe - Loja</p>
  `;
  send(
    'Pedido Recebido - Loja',
    user.email,
    message
  );
}

  // PEDIDO CANCELADO
const cancelPurchase = (user: UserInterface, purchase: PurchaseInterface) => {
  const message = `
    <h1 style="text-align:center;">Pedido Cancelado</h1>
    <br />
    <p>O pedido feito no dia ${format(purchase.createdAt, 'dd/MM/yyyy')} foi cancelado.</p>
    <br />
    <a href="${link}">Acesse a loja para saber mais.</a>
    <br /><br />
    <p>Atenciosamente,</p>
    <p>Equipe - Loja</p>
  `;
  send(
    "Pedido Cancelado - Loja",
    user.email,
    message
  );
}

// ATUALIZACAO DE PAGAMENTO E ENTREGA
const updatePurchase = (user: UserInterface, purchase: PurchaseInterface, status: string, data: Date, type:string ) => {
  const message = `
    <h1 style="text-align:center;">Pedido Atualizado</h1>
    <br />
    <p>O pedido feito no dia ${format(purchase.createdAt, 'dd/MM/yyyy')} teve uma atualiza????o.</p>
    <br />
    <p>Nova Atualiza????o: ${status} - realizado em ${format(data, 'dd/MM/yyyyy HH:mm')}</p>
    <br />
    <a href="${link}">Acesse a loja para saber mais.</a>
    <br /><br />
    <p>Atenciosamente,</p>
    <p>Equipe - Loja</p>
  `;
  send(
    "Pedido Atualizado - Loja",
    user.email,
    message
  );
}

export {
  submitNewPurchase,
  cancelPurchase,
  updatePurchase,
};
