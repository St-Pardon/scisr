const randomStr = (): string => {
  const char: string =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890$-_.+!*()';
  let res: string = '';

  for (let i: number = 0; i < 6; i++) {
    const rand: number = Math.floor(Math.random() * char.length) + 1;
    res += char[rand];
  }

  return res;
};

export default randomStr;
