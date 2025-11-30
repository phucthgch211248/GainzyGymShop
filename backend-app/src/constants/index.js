module.exports = {
  ROLES: {
    USER: 'user',
    ADMIN: 'admin',
  },

  ORDER_STATUS: {
    PENDING: 'pending',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
  },

  PAYMENT_STATUS: {
    PENDING: 'pending',
    PAID: 'paid',
    FAILED: 'failed',
  },

  PAYMENT_METHOD: {
    COD: 'cod',
    BANK_TRANSFER: 'bank_transfer',
    CREDIT_CARD: 'credit_card',
  },
};