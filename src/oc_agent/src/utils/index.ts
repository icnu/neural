import { Ed25519KeyIdentity } from '@dfinity/identity';
import * as fsIdentityJson from '../../private-key.json';

export * from './progress';
export * from './render';

export function toHexString(input: Uint8Array | number[] ): string {
  const uint8Array = input instanceof Uint8Array
    ? input : new Uint8Array(input);

  return Array.from(uint8Array)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

export function fromHexString(hex: string): Uint8Array | number[] {
  if (hex.startsWith('0x')) hex = hex.slice(2);
  if (hex.length % 2 !== 0) throw new Error('Invalid hex string length');
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

export function e8sToUnits(e8s: bigint): string {
  const scaled = BigInt(e8s) / BigInt(1_000_000);
  const whole = scaled / BigInt(100);
  const fraction = scaled % BigInt(100);
  return `${whole.toString()}.${fraction.toString().padStart(2, '0')}`
}

export function displayFormatHexString(hex: string): string {
  if ( hex.length <= 14 ) return hex;
  return `${hex.slice(0, 7)}..${hex.slice(hex.length - 7)}`;
}

export function loadIdentity(): Ed25519KeyIdentity {
  return Ed25519KeyIdentity.fromJSON(JSON.stringify(fsIdentityJson));
}