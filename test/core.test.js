import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  INT8_BYTES,
  INT16_BYTES,
  INT32_BYTES,
  BIGINT64_BYTES,
  readInt8,
  readUint8,
  readInt16,
  readUint16,
  readInt32,
  readUint32,
  readBigInt64,
  readBigUint64,
  writeInt8,
  writeUint8,
  writeInt16,
  writeUint16,
  writeInt32,
  writeUint32,
  writeBigInt64,
  writeBigUint64,
  checkOffset,
  checkBounds,
} from '../src/index.js';

test('byte-width constants', () => {
  assert.equal(INT8_BYTES, 1);
  assert.equal(INT16_BYTES, 2);
  assert.equal(INT32_BYTES, 4);
  assert.equal(BIGINT64_BYTES, 8);
});

test('round-trip 8-bit values', () => {
  const buf = new Uint8Array(1);
  writeUint8(buf, 0xff);
  assert.equal(readUint8(buf), 0xff);
  writeInt8(buf, -1);
  assert.equal(readInt8(buf), -1);
  writeInt8(buf, 127);
  assert.equal(readInt8(buf), 127);
});

test('round-trip 16-bit values including negative', () => {
  const buf = new Uint8Array(2);
  writeUint16(buf, 0x0102);
  assert.deepEqual(Array.from(buf), [0x01, 0x02]);
  assert.equal(readUint16(buf), 0x0102);
  writeInt16(buf, -1);
  assert.deepEqual(Array.from(buf), [0xff, 0xff]);
  assert.equal(readInt16(buf), -1);
  writeInt16(buf, -4660);
  assert.equal(readInt16(buf), -4660);
});

test('round-trip 32-bit values including extremes', () => {
  const buf = new Uint8Array(4);
  writeUint32(buf, 0xffffffff);
  assert.deepEqual(Array.from(buf), [0xff, 0xff, 0xff, 0xff]);
  assert.equal(readUint32(buf), 0xffffffff);
  writeInt32(buf, -1);
  assert.equal(readInt32(buf), -1);
  writeInt32(buf, -2147483648);
  assert.equal(readInt32(buf), -2147483648);
  writeInt32(buf, 2147483647);
  assert.equal(readInt32(buf), 2147483647);
});

test('round-trip 64-bit values including extremes', () => {
  const buf = new Uint8Array(8);
  writeBigUint64(buf, 0xffffffffffffffffn);
  assert.equal(readBigUint64(buf), 0xffffffffffffffffn);
  writeBigInt64(buf, -1n);
  assert.equal(readBigInt64(buf), -1n);
  writeBigInt64(buf, -9223372036854775808n);
  assert.equal(readBigInt64(buf), -9223372036854775808n);
  writeBigInt64(buf, 9223372036854775807n);
  assert.equal(readBigInt64(buf), 9223372036854775807n);
});

test('partial-buffer writes respect offsets', () => {
  const buf = new Uint8Array(16);
  writeUint16(buf, 0x0102, 5);
  assert.equal(buf[4], 0);
  assert.equal(buf[5], 0x01);
  assert.equal(buf[6], 0x02);
  assert.equal(buf[7], 0);
  assert.equal(readUint16(buf, 5), 0x0102);
});

test('subarray view uses its own offset', () => {
  const backing = new Uint8Array(16);
  writeUint32(backing, 0x0a0b0c0d, 6);
  const sub = backing.subarray(4, 12);
  assert.equal(readUint32(sub, 2), 0x0a0b0c0d);
});

test('checkOffset rejects negative and non-integer', () => {
  assert.throws(() => checkOffset(-1), RangeError);
  assert.throws(() => checkOffset(1.5), RangeError);
  assert.throws(() => checkOffset(NaN), RangeError);
  assert.throws(() => checkOffset(Infinity), RangeError);
});

test('checkBounds rejects out-of-range writes', () => {
  assert.throws(() => checkBounds(new Uint8Array(2), 0, 4), RangeError);
  assert.throws(() => checkBounds(new Uint8Array(2), 1, 2), RangeError);
  assert.doesNotThrow(() => checkBounds(new Uint8Array(2), 0, 2));
});

test('read and write at the exact end of a buffer succeed', () => {
  const buf = new Uint8Array(4);
  writeUint32(buf, 0x12345678, 0);
  assert.equal(readUint32(buf, 0), 0x12345678);
});

test('out-of-range offset on write throws RangeError', () => {
  const buf = new Uint8Array(2);
  assert.throws(() => writeUint16(buf, 1, 1), RangeError);
});

test('out-of-range offset on read throws RangeError', () => {
  const buf = new Uint8Array(2);
  assert.throws(() => readUint32(buf, 0), RangeError);
});

test('default offset is zero', () => {
  const buf = new Uint8Array(4);
  writeUint32(buf, 0x12345678);
  assert.equal(readUint32(buf), 0x12345678);
});
