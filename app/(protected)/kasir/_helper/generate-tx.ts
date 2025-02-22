export const generateTx = () => {
  // TRX2022timestamp
  const trx = "TRX" + new Date().getFullYear();
  const timestamp = new Date().getTime();
  return trx + timestamp;
};
