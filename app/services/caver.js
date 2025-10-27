const { caver, klaytn } = window;

export async function getKlayBalance(address) {
  const pebBalance = await caver.klay.getBalance(
    address || klaytn.selectedAddress,
  );
  const balance = caver.utils.fromPeb(pebBalance, 'KLAY');

  return balance;
}
