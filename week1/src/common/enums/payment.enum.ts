enum PaymentStatus {
  Unpaid = "UNPAID",
  Paid = "PAID",
  Refunded = "REFUNDED",
}

enum PaymentMethod {
  Cash = "CASH",
  BankTransfer = "BANK_TRANSFER",
  EWallet = "E_WALLET",
  CreditCard = "CREDIT_CARD",
}

export { PaymentStatus, PaymentMethod };
