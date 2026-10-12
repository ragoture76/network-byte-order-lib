/**
 * Width constants, in bytes, for each supported integer type.
 * Exported so callers can size buffers without hardcoding magic numbers.
 */
export const INT8_BYTES = 1;
export const UINT8_BYTES = 1;
export const INT16_BYTES = 2;
export const UINT16_BYTES = 2;
export const INT32_BYTES = 4;
export const UINT32_BYTES = 4;
export const BIGINT64_BYTES = 8;
export const BIGUINT64_BYTES = 8;

/**
 * Throw if offset is negative or not an integer. DataView accepts any number
 * here but silent non-integer behaviour is a source of bugs, so we reject it
 * up front.
 */
export function checkOffset(offset) {
  if (!Number.isInteger(offset) || offset < 0) {
    throw new RangeError(`offset must be a non-negative integer; got ${String(offset)}`);
  }
}

/**
 * Throw if offset+size exceeds buffer length. Works for both Number sizes
 * (up to 4 bytes) and BigInt sizes (8 bytes).
 */
export function checkBounds(buffer, offset, size) {
  if (offset + size > buffer.length) {
    throw new RangeError(
      `write of ${size} bytes at offset ${offset} exceeds buffer length ${buffer.length}`,
    );
  }
}

/**
 * Construct a DataView bound to a Uint8Array. DataView interprets bytes using
 * the platform's native int representation by default; passing explicit
 * littleEndian=false forces big-endian (network byte order) regardless of the
 * host's CPU, which is the whole point of this library.
 */
function view(buffer) {
  return new DataView(
    buffer.buffer,
    buffer.byteOffset,
    buffer.byteLength,
  );
}

export function readInt8(buffer, offset = 0) {
  checkOffset(offset);
  checkBounds(buffer, offset, INT8_BYTES);
  return view(buffer).getInt8(offset);
}

export function readUint8(buffer, offset = 0) {
  checkOffset(offset);
  checkBounds(buffer, offset, UINT8_BYTES);
  return view(buffer).getUint8(offset);
}

export function readInt16(buffer, offset = 0) {
  checkOffset(offset);
  checkBounds(buffer, offset, INT16_BYTES);
  return view(buffer).getInt16(offset, false);
}

export function readUint16(buffer, offset = 0) {
  checkOffset(offset);
  checkBounds(buffer, offset, UINT16_BYTES);
  return view(buffer).getUint16(offset, false);
}

export function readInt32(buffer, offset = 0) {
  checkOffset(offset);
  checkBounds(buffer, offset, INT32_BYTES);
  return view(buffer).getInt32(offset, false);
}

export function readUint32(buffer, offset = 0) {
  checkOffset(offset);
  checkBounds(buffer, offset, UINT32_BYTES);
  return view(buffer).getUint32(offset, false);
}

export function readBigInt64(buffer, offset = 0) {
  checkOffset(offset);
  checkBounds(buffer, offset, BIGINT64_BYTES);
  return view(buffer).getBigInt64(offset, false);
}

export function readBigUint64(buffer, offset = 0) {
  checkOffset(offset);
  checkBounds(buffer, offset, BIGUINT64_BYTES);
  return view(buffer).getBigUint64(offset, false);
}

export function writeInt8(buffer, value, offset = 0) {
  checkOffset(offset);
  checkBounds(buffer, offset, INT8_BYTES);
  view(buffer).setInt8(offset, value);
}

export function writeUint8(buffer, value, offset = 0) {
  checkOffset(offset);
  checkBounds(buffer, offset, UINT8_BYTES);
  view(buffer).setUint8(offset, value);
}

export function writeInt16(buffer, value, offset = 0) {
  checkOffset(offset);
  checkBounds(buffer, offset, INT16_BYTES);
  view(buffer).setInt16(offset, value, false);
}

export function writeUint16(buffer, value, offset = 0) {
  checkOffset(offset);
  checkBounds(buffer, offset, UINT16_BYTES);
  view(buffer).setUint16(offset, value, false);
}

export function writeInt32(buffer, value, offset = 0) {
  checkOffset(offset);
  checkBounds(buffer, offset, INT32_BYTES);
  view(buffer).setInt32(offset, value, false);
}

export function writeUint32(buffer, value, offset = 0) {
  checkOffset(offset);
  checkBounds(buffer, offset, UINT32_BYTES);
  view(buffer).setUint32(offset, value, false);
}

export function writeBigInt64(buffer, value, offset = 0) {
  checkOffset(offset);
  checkBounds(buffer, offset, BIGINT64_BYTES);
  view(buffer).setBigInt64(offset, value, false);
}

export function writeBigUint64(buffer, value, offset = 0) {
  checkOffset(offset);
  checkBounds(buffer, offset, BIGUINT64_BYTES);
  view(buffer).setBigUint64(offset, value, false);
}
