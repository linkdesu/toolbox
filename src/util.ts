import { Buffer } from 'buffer'

export function hexToBuf(input: string): Buffer {
  let hex
  if (input.startsWith('0x')) {
    hex = input.substr(2)
  } else {
    hex = input
  }

  return Buffer.from(hex, 'hex')
}
