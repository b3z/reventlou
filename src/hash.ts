
export function md5(toHash: string) {
  return require('crypto').createHash('md5').update(toHash, 'utf8').digest('hex');
}
