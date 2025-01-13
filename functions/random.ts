export function rString(length: number): string {
  
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomCharCode = Math.floor(Math.random() * 62);
    if (randomCharCode < 26) {
      result += String.fromCharCode(65 + randomCharCode);
    } else if (randomCharCode < 52) {
      result += String.fromCharCode(97 + (randomCharCode - 26));
    } else {
      result += String.fromCharCode(48 + (randomCharCode - 52));
    }
  }
  return result;
  
}