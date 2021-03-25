import transporter from 'nodemailer'
import createTransport from '../config/email';
import config from '../config/index';
import { format } from 'date-fns';
import { UserInterface } from '@interfaces/User';
import { PurchaseInterface } from '@interfaces/Purchase';

const link = config.store;

let mail = transporter.createTransport(createTransport)

const send = ({ subject, emails, message}, cb = null) => {
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
      <p>O pedido realizado hoje, no dia ${format(purchase.createdAt, 'dd/MM/YYYY')}, foi recebido com sucesso.</p>
      <br />
      <a href="${link}">Acesse a loja para saber mais.</a>
      <br /><br />
      <p>Atenciosamente,</p>
      <p>Equipe - Loja TI</p>
  `;
  send({
    subject: 'Pedido Recebido - Loja TI',
    emails: user.email,
    message
  });
}

  // PEDIDO CANCELADO
const cancelPurchase = (user: UserInterface, purchase: PurchaseInterface) => {
  const message = `
    <h1 style="text-align:center;">Pedido Cancelado</h1>
    <br />
    <p>O pedido feito no dia ${moment(pedido.createdAt).format("DD/MM/YYYY")} foi cancelado.</p>
    <br />
    <a href="${link}">Acesse a loja para saber mais.</a>
    <br /><br />
    <p>Atenciosamente,</p>
    <p>Equipe - Loja TI</p>
  `;
  send({
    subject: "Pedido Cancelado - Loja TI",
    emails: usuario.email,
    message
  });
}

// ATUALIZACAO DE PAGAMENTO E ENTREGA
const updatePurchase = (usuario, pedido, status, data, tipo ) => {
  const message = `
    <h1 style="text-align:center;">Pedido Atualizado</h1>
    <br />
    <p>O pedido feito no dia ${moment(pedido.createdAt).format("DD/MM/YYYY")} teve uma atualização.</p>
    <br />
    <p>Nova Atualização: ${status} - realizado em ${moment(data).format("DD/MM/YYYY HH:mm")}</p>
    <br />
    <a href="${link}">Acesse a loja para saber mais.</a>
    <br /><br />
    <p>Atenciosamente,</p>
    <p>Equipe - Loja TI</p>
  `;
  send({
    subject: "Pedido Atualizado - Loja TI",
    emails: usuario.email,
    message
  });
}

export {
  submitNewPurchase,
  cancelPurchase,
  updatePurchase,
};
