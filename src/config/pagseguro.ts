export default {
  mode: process.env.NODE_ENV === 'production' ? 'live' : 'sandbox',
  sandbox: process.env.NODE_ENV === 'production' ? false : true,
  sandbox_email: process.env.NODE_ENV === 'production' ? null : 'email@sandbox.pagseguro.com.br',
  email: 'vh.alemao@gmail.com',
  token: 'EEDB08F86D454C5484FE319A01226D90',
  notificationURL: ''//url de notificação ,
}