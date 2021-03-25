
const pagSeguroConfig = {
  mode: process.env.NODE_ENV === 'production' ? 'live' : 'sandbox',
  sandbox: process.env.NODE_ENV === 'production' ? false : true,
  sandbox_email: process.env.NODE_ENV === 'production' ? null : 'email@sandbox.pagseguro.com.br',
  email: process.env.EMAIL_PAGSEGURO,
  token: process.env.TOKEN_PAGSEGURO,
  notificationURL: 'http://localhost:3000/v1/ap1/payments/notification'//url de notificação ,
}

export { pagSeguroConfig }