import transporter from 'nodemailer'
import createTransport from '../config/email';
import config from '../config/index';

const link = config.api;

let mail = transporter.createTransport(createTransport)

export default ({ user, recovery }, cb) => {
    const message = `
      <h1 style="text-align: center;">Recuperacao de Senha</h1>
      <br />
      <p>
          Aqui está o link para redefinir a sua senha. Acesse ele e digite sua nova senha:
      </p>
      <a href="${link}/v1/api/user/recovered-password?token=${recovery.token}">
        ${link}/v1/api/user/recovered-password?token=${recovery.token}
      </a>
      <br /><br /><hr />
      <p>
        Obs.: Se você não solicitou a redefinicao, apenas ignore esse email.
      </p>
      <br />
      <p>Atenciosamente, Loja TI</p>
    `;

    const optionsEmail = {
      from: 'naoresponder@lojati.com',
      to: user.email,
      subject: 'Redefinicao de Senha',
      html: message
    };

    if( process.env.NODE_ENV === "production" ){
      mail.sendMail(optionsEmail, (error, info) => {
        if(error){
          console.log(error);
          return cb('There was an error sending the email, please try again.');
        } else {
          return cb(null, 'Password reset link was successfully sent to your email.');
        }
      });
    } else {
    console.log(optionsEmail);
    return cb(null, 'Link to reset password has been successfully sent to your email.');
}
};