/* 
  Buffers are array of bytes (a group of 8 bits) that store binary data (or hex)

  Hex -> a number system that counts in base 16. Each binary data is stored as a group of 4 bits
  0 - 0000
  1 - 0001
  2 - 0010
  3 - 0011
  4 - 0100
  5 - 0101
  6 - 0110
  7 - 0111
  8 - 1000
  9 - 1001
  A - 1010 - 10
  B - 1011 - 11
  C - 1100 - 12
  D - 1101 - 13
  E - 1110 - 14
  F - 1111 - 15
*/

const { Buffer } = require('Buffer');

const buffer = Buffer.alloc(10) // 10 bytes i.e 80 bits;

buffer[1] = 0xEF;

console.log(buffer);

