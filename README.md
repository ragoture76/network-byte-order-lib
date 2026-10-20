# network-byte-order-lib

Reads and writes signed and unsigned integers in big-endian (network) byte order into and out of `Uint8Array` buffers. Supports 8-, 16-, and 32-bit values as JavaScript `Number`s, and 64-bit values as `BigInt`s.

```js
import { writeUint32, readUint32 } from 'network-byte-order-lib';

const buf = new Uint8Array(4);
writeUint32(buf, 0x12345678, 0);
console.log(readUint32(buf, 0)); // 305419896
```

All functions take the buffer first, then the value (for writes) or offset (for reads), with offset defaulting to `0`. Reads return `Number` for 32 bits and below, `BigInt` for 64-bit functions. Writes mutate the buffer in place and return `undefined`.

## Why this exists

Implementations that pack integers into bytes tend to grow `Buffer`-shaped dependencies. This library uses the platform's `DataView` with its `littleEndian` flag forced to `false`, so encoding is big-endian regardless of host CPU, with zero runtime dependencies and no polyfills.

The trade-off is that `DataView` bounds-checks every call, so you pay for a length check on each access rather than once per batch. For the protocol-decoding workload this targets — pulling a few well-typed fields out of a packet — that cost is negligible and the safety is worth it.

## Edge cases

Offset must be a non-negative integer; fractional, `NaN`, or negative values throw `RangeError` before any read or write happens. Out-of-range access also throws `RangeError`. `DataView`'s truncation semantics apply to oversized values (e.g. `writeUint8(buf, 300)` writes `44`), so callers are responsible for range-checking the values they hand in.

## Performance

The window keeps a bounded buffer, so `push` is constant time and memory does not
grow with the length of the stream. `peak` and `trough` are linear in the window
size, which is the trade that keeps `push` cheap.

