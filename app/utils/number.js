import numeral from 'numeral';

export function formatBalance(value) {
  return numeral(value).format('0,0');
}
