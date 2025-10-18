function generateReferralCode(name: string, length = 3): string {
  const digits = '0123456789';
  let code = '';

  for (let i = 0; i < length; i++) {
    code += digits[Math.floor(Math.random() * digits.length)];
  }

  const prefix = name.replace(/\s+/g, '').toUpperCase();
  return `${prefix}${code}`;
}

export default generateReferralCode;
