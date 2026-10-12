# Primitive Type System — SK-09

**Module:** `@ecosystem/semantic-kernel`  
**Layer:** B. Semantic Kernel — Pure TypeScript  
**Milestone:** SK-09 — Primitive Type System  
**Status:** Implemented  
**ADR:** [ADR-017](../adr/ADR-017-primitive-type-system.md)

---

## 1. Purpose

The Primitive Type System establishes the authoritative vocabulary of foundational
semantic value categories in the platform. It answers the question:

> "What *kind* of value is this?" — at the most basic semantic level.

It is distinct from:

| Concept | Description |
|---|---|
| `SemanticElementKind` (SK-06) | Classifies semantic *definitions* (TYPE, ACTION, …) |
| Future `TypeDefinition` | An authored semantic type artifact (e.g. `sales.CustomerCode`) |
| Future `FieldDefinition` | A declared field with constraints, nullability, and cardinality |
| Runtime Validation | Evaluation of a live instance value against compiled rules |
| Database Column Types | Storage-engine specifics (INT32, VARCHAR, TIMESTAMP_TZ, …) |

---

## 2. Authoritative Primitive Type Set

| Code | Meaning | Canonical Value Representation |
|---|---|---|
| `STRING` | Unicode text | JavaScript `string` |
| `BOOLEAN` | Binary truth value | JavaScript `boolean` (`true` \| `false`) |
| `INTEGER` | Exact integer | Canonical decimal string (see §5) |
| `DECIMAL` | Exact base-10 decimal | Canonical decimal string (see §6) |
| `DATE` | Calendar date (no timezone) | `"YYYY-MM-DD"` (ISO 8601) |
| `TIME` | Time of day (no timezone) | `"HH:mm:ss"` or `"HH:mm:ss.sss"` |
| `DATETIME` | Instant with explicit offset | RFC 3339 / ISO 8601 (offset required) |

No other codes are recognized. Unrecognized codes are rejected by `parsePrimitiveType`.

---

## 3. PrimitiveType Contract

```typescript
import {
  PrimitiveTypes,
  type PrimitiveType,
  isPrimitiveType,
  parsePrimitiveType,
} from '@ecosystem/semantic-kernel';

// Canonical code map
PrimitiveTypes.STRING  // → 'STRING'
PrimitiveTypes.INTEGER // → 'INTEGER'
// …

// Type guard
isPrimitiveType('STRING')  // true
isPrimitiveType('varchar') // false
isPrimitiveType(42)        // false

// Throwing parser
parsePrimitiveType('BOOLEAN') // → 'BOOLEAN'
parsePrimitiveType('string')  // throws PrimitiveTypeValidationError (UNKNOWN)
parsePrimitiveType('')        // throws (EMPTY)
parsePrimitiveType(' DATE ')  // throws (WHITESPACE)
```

The type code set is **closed**. Extending it at runtime is not supported.

---

## 4. PrimitiveValue Contract

```typescript
import {
  type PrimitiveValue,
  createPrimitiveValue,
  PrimitiveTypes,
} from '@ecosystem/semantic-kernel';
```

`PrimitiveValue` is a discriminated union:

```typescript
type PrimitiveValue =
  | { readonly type: 'STRING';   readonly value: string }
  | { readonly type: 'BOOLEAN';  readonly value: boolean }
  | { readonly type: 'INTEGER';  readonly value: string }
  | { readonly type: 'DECIMAL';  readonly value: string }
  | { readonly type: 'DATE';     readonly value: string }
  | { readonly type: 'TIME';     readonly value: string }
  | { readonly type: 'DATETIME'; readonly value: string }
```

All created instances are **frozen** (`Object.freeze`). There are no setters.

---

## 5. STRING Semantics

- Accepts any string up to `STRING_MAX_LENGTH` (65,536) characters.
- Unicode code-point sequence is preserved exactly as supplied.
- No trimming, lowercasing, whitespace normalization, or NFC conversion.
- An empty string `""` is a **valid** STRING value; it is **not** missing and **not** null.
- Business constraints (minLength, maxLength, regex) belong to future SK-10 Facets.

```typescript
createPrimitiveValue(PrimitiveTypes.STRING, 'Acme Corp') // valid
createPrimitiveValue(PrimitiveTypes.STRING, '')          // valid (empty ≠ missing)
createPrimitiveValue(PrimitiveTypes.STRING, 123)         // throws — not a string
```

---

## 6. BOOLEAN Semantics

- Accepts only JavaScript `boolean` primitive: `true` or `false`.
- `"true"`, `"false"`, `1`, `0`, `null` are all **rejected**.
- There is no implicit truth-y/false-y coercion.
- Missing (absent) and `false` are semantically different.

```typescript
createPrimitiveValue(PrimitiveTypes.BOOLEAN, true)    // valid
createPrimitiveValue(PrimitiveTypes.BOOLEAN, false)   // valid
createPrimitiveValue(PrimitiveTypes.BOOLEAN, 'true')  // throws
createPrimitiveValue(PrimitiveTypes.BOOLEAN, 0)       // throws
```

---

## 7. INTEGER Semantics

### 7.1 Representation

INTEGER values are stored as **canonical decimal strings**, not JavaScript
numbers. This prevents precision loss for values beyond `Number.MAX_SAFE_INTEGER`
(9,007,199,254,740,991).

### 7.2 Grammar

```
integer := "0" | "-"? [1-9][0-9]*
```

**Accepted:**
```
"0"   "-1"   "42"   "9007199254740993"
```

**Rejected:**
```
"+1"   "01"   "-0"   "1.0"   "1e3"   " 42"   "42 "   ""
```

### 7.3 Bounds

Up to **38 significant digits** (excluding the `-` sign character).

### 7.4 Safe-integer helper

```typescript
import { createIntegerValueFromSafeNumber } from '@ecosystem/semantic-kernel';

createIntegerValueFromSafeNumber(42)          // valid
createIntegerValueFromSafeNumber(Number.MAX_SAFE_INTEGER) // valid
createIntegerValueFromSafeNumber(9.5)         // throws — not a safe integer
createIntegerValueFromSafeNumber(9e18)        // throws — not a safe integer
```

For integers beyond `Number.MAX_SAFE_INTEGER`, pass the canonical string:

```typescript
createPrimitiveValue(PrimitiveTypes.INTEGER, '9007199254740993')
```

---

## 8. DECIMAL Semantics

### 8.1 Representation

DECIMAL values are stored as **canonical decimal strings** preserving scale.

### 8.2 Grammar

```
decimal := "-"? ("0" | [1-9][0-9]*) ("." [0-9]+)?
```

**Accepted:**
```
"0"   "1.25"   "-42.500"   "12345678901234567890.12345"
```

**Rejected:**
```
"NaN"   "Infinity"   "-Infinity"   "1e100"   "1,000.00"   "1.2.3"   ""
```

### 8.3 Bounds

- Total digits: ≤ 38
- Fractional digits: ≤ 18

### 8.4 Scale policy and equality

`DECIMAL("1.0")` and `DECIMAL("1.00")` have **different canonical strings**
and are therefore **structurally unequal** via `equalsPrimitiveValue`.
Scale is preserved as declared. If numeric equivalence is needed, the consumer
must implement it (e.g., by normalizing trailing zeros before comparison).

### 8.5 DECIMAL is not Money

Currency code, rounding policy, and financial semantics belong to higher-level
authored type definitions, not to the DECIMAL primitive.

---

## 9. DATE Semantics

- Calendar date without a timezone or time-of-day.
- Canonical format: `"YYYY-MM-DD"` (ISO 8601).
- Calendar validation: actual month days enforced; leap-year rule applied.
- `"2026-02-30"` → rejected; `"2024-02-29"` → valid (leap year).
- **No timezone** is inferred from the host environment.
- Do not convert a DATE value to a JavaScript `Date` object for validation.

```typescript
createPrimitiveValue(PrimitiveTypes.DATE, '2026-10-12')  // valid
createPrimitiveValue(PrimitiveTypes.DATE, '2026-02-30')  // throws — invalid day
createPrimitiveValue(PrimitiveTypes.DATE, '2026-13-01')  // throws — invalid month
```

---

## 10. TIME Semantics

- Time of day without a calendar date or timezone.
- Canonical format: `"HH:mm:ss"` or `"HH:mm:ss.sss"` (millisecond precision).
- Ranges: `00–23` hours, `00–59` minutes, `00–59` seconds, `000–999` ms.
- `"24:00:00"`, `"25:00:00"`, `"12:60:00"` are all rejected.
- No timezone is inferred.

```typescript
createPrimitiveValue(PrimitiveTypes.TIME, '14:30:00')      // valid
createPrimitiveValue(PrimitiveTypes.TIME, '14:30:00.500')  // valid (ms)
createPrimitiveValue(PrimitiveTypes.TIME, '24:00:00')      // throws
```

---

## 11. DATETIME Semantics

### 11.1 Interpretation

DATETIME represents a specific point in time with an **explicit UTC offset**.
It is NOT a local date-time without an offset.

### 11.2 Canonical format

```
YYYY-MM-DDTHH:mm:ss[.sss]Z
YYYY-MM-DDTHH:mm:ss[.sss]+HH:MM
YYYY-MM-DDTHH:mm:ss[.sss]-HH:MM
```

**Examples:**
```
"2026-10-12T14:30:00Z"
"2026-10-12T14:30:00.500Z"
"2026-10-12T17:30:00+03:00"
```

**Rejected:**
```
"2026-10-12T14:30:00"      — no offset → rejected
"2026-10-12 14:30:00Z"     — space separator → rejected
"2026-10-12T25:00:00Z"     — invalid hour
"2026-02-30T00:00:00Z"     — invalid calendar date
```

### 11.3 Timezone determinism

The host timezone is **never** consulted. Parsing and validation are
deterministic across Node.js and browser environments. The JavaScript `Date`
object is **not** used for DATETIME parsing or validation.

### 11.4 Equality

Two DATETIME values are equal when their canonical strings are equal
(character-by-character). `"2026-10-12T14:30:00Z"` and `"2026-10-12T17:30:00+03:00"`
have different strings and compare as **unequal** via `equalsPrimitiveValue`,
even though they represent the same instant. Instant-aware comparison requires
normalization outside the Kernel.

---

## 12. Missing / Null / Value

| State | Meaning | Represented as |
|---|---|---|
| Missing | No value supplied | Absence of the field (TypeScript `undefined`) |
| Null | Explicitly absent value | Not a valid `PrimitiveValue` — rejected by `parsePrimitiveValue` |
| Value | A canonical primitive value | A frozen `PrimitiveValue` object |

`null` is **never** a valid `PrimitiveValue.value`. Optionality and nullability
are field-definition concerns (future SK-10 Facets), not primitive-level rules.

---

## 13. No Implicit Coercion

The following conversions are **explicitly rejected**:

| Input | Attempted type | Outcome |
|---|---|---|
| `"true"` | BOOLEAN | Rejected — not a boolean primitive |
| `1` | BOOLEAN | Rejected |
| `"42"` | INTEGER | Only valid if it's already a string in INTEGER grammar |
| `42` (number) | INTEGER | Rejected — must be a string |
| `"1.5"` | INTEGER | Rejected — contains decimal point |
| `NaN` | DECIMAL | Rejected |
| `"today"` | DATE | Rejected — not ISO 8601 |
| `""` | INTEGER/DATE/TIME | Rejected — does not match grammars |

SK-09 owns **representation validity** only, not business-data conversion.
Adapters may provide explicit conversion functions under defined policies.

---

## 14. Shape Validation API

```typescript
import { validatePrimitiveValue } from '@ecosystem/semantic-kernel';

const result = validatePrimitiveValue(PrimitiveTypes.DATE, '2026-02-30');
if (!result.valid) {
  console.error(result.code, result.message);
  // PRIMITIVE_VALUE_INVALID_DATE  Day 30 is out of range for 2026-02…
}
```

`validatePrimitiveValue` is a **shape-only** check:
- Does not enforce business constraints (minLength, ranges, regex).
- Does not access model fields, registries, or I/O.
- Does not use the current time, locale, or host timezone.
- Returns a `PrimitiveValidationResult` (`{ valid: true }` or `{ valid: false, code, message }`).

---

## 15. Construction

```typescript
import { createPrimitiveValue, PrimitiveTypes } from '@ecosystem/semantic-kernel';

const name = createPrimitiveValue(PrimitiveTypes.STRING, 'Acme');
const active = createPrimitiveValue(PrimitiveTypes.BOOLEAN, true);
const seq = createPrimitiveValue(PrimitiveTypes.INTEGER, '9007199254740993');
const total = createPrimitiveValue(PrimitiveTypes.DECIMAL, '1250.75');
const date = createPrimitiveValue(PrimitiveTypes.DATE, '2026-10-12');
const time = createPrimitiveValue(PrimitiveTypes.TIME, '14:30:00');
const ts = createPrimitiveValue(PrimitiveTypes.DATETIME, '2026-10-12T14:30:00Z');
```

All values are `Object.freeze`d at construction. No setters exist.

---

## 16. Equality

```typescript
import { equalsPrimitiveValue } from '@ecosystem/semantic-kernel';

equalsPrimitiveValue(
  createPrimitiveValue(PrimitiveTypes.INTEGER, '10'),
  createPrimitiveValue(PrimitiveTypes.INTEGER, '10'),
) // true

equalsPrimitiveValue(
  createPrimitiveValue(PrimitiveTypes.INTEGER, '10'),
  createPrimitiveValue(PrimitiveTypes.DECIMAL, '10.0'),
) // false — different type

equalsPrimitiveValue(
  createPrimitiveValue(PrimitiveTypes.DECIMAL, '1.0'),
  createPrimitiveValue(PrimitiveTypes.DECIMAL, '1.00'),
) // false — different scale representation
```

Cross-type equality is **always false**. DECIMAL scale equality is string-based.

---

## 17. Serialization

```typescript
import { serializePrimitiveValue } from '@ecosystem/semantic-kernel';
```

| Input | JSON Output |
|---|---|
| `STRING("Acme")` | `{ "type": "STRING", "value": "Acme" }` |
| `BOOLEAN(true)` | `{ "type": "BOOLEAN", "value": true }` |
| `INTEGER("9007199254740993")` | `{ "type": "INTEGER", "value": "9007199254740993" }` |
| `DECIMAL("1250.75")` | `{ "type": "DECIMAL", "value": "1250.75" }` |
| `DATE("2026-10-12")` | `{ "type": "DATE", "value": "2026-10-12" }` |
| `TIME("14:30:00")` | `{ "type": "TIME", "value": "14:30:00" }` |
| `DATETIME("2026-10-12T14:30:00Z")` | `{ "type": "DATETIME", "value": "2026-10-12T14:30:00Z" }` |

Output objects are frozen. No private state is serialized.

---

## 18. Deserialization

```typescript
import { parsePrimitiveValue } from '@ecosystem/semantic-kernel';

const val = parsePrimitiveValue({ type: 'DATE', value: '2026-10-12' }); // valid
parsePrimitiveValue({ type: 'DATE', value: null });   // throws NULL_REJECTED
parsePrimitiveValue({ type: 'BLOB', value: '…' });    // throws UNKNOWN_TYPE
parsePrimitiveValue({ type: 'DATE' });                // throws MISSING_FIELD
parsePrimitiveValue({ type: 'DATE', value: '2026-10-12', extra: 1 }); // throws EXTRA_FIELD
```

The parser enforces:
1. Plain object (not null, not array, not class instance).
2. Only `type` and `value` fields — no extras.
3. `type` is a recognized PrimitiveType code.
4. `value` is not null.
5. `value` passes shape validation for `type`.

---

## 19. Round-Trip Guarantee

```
createPrimitiveValue(type, value)
      │ serializePrimitiveValue
      ▼
PrimitiveValueJSON
      │ parsePrimitiveValue
      ▼
PrimitiveValue (equalsPrimitiveValue → true)
```

---

## 20. Type Narrowing Helpers

```typescript
import { isIntegerValue, isDateValue } from '@ecosystem/semantic-kernel';

if (isIntegerValue(pv)) {
  // pv.value is string — INTEGER canonical decimal
}
if (isDateValue(pv)) {
  // pv.value is string — "YYYY-MM-DD"
}
```

---

## 21. Relationships to Other Kernel Primitives

| Primitive | Relationship |
|---|---|
| `SemanticElementKind` (SK-06) | Separate classification; `TYPE` ≠ `STRING` |
| `SemanticVersion` (SK-07) | Not a primitive value; governs definition versions |
| `ElementRef` (SK-08) | Not a primitive value; expresses reference intent |
| Future `TypeDefinition` | An authored artifact; may declare its underlying `PrimitiveType` |
| Future `FieldDefinition` (SK-10) | A field declaration; will carry `PrimitiveType` + nullability + constraints |
| Future Runtime Validation | Instance-level validation against compiled field rules |

---

## 22. Security and Portability

- No `eval()`, `Function()`, or dynamic module loading.
- No filesystem or network I/O.
- No DOM or Node.js-only APIs.
- Resource bounds enforced: STRING ≤ 65,536 chars, INTEGER ≤ 38 digits, DECIMAL ≤ 38 total / 18 fractional digits.
- Calendar and time validation uses pure arithmetic, not the host `Date` object.
- No sensitive diagnostic data or raw input echoed.

---

## 23. Known Limitations

- **DECIMAL scale equality:** `equalsPrimitiveValue` compares canonical strings; `"1.0"` ≠ `"1.00"`. Numeric normalization is intentionally deferred.
- **DATETIME instant equality:** Two strings representing the same instant with different offsets compare as unequal.
- **Large integer range:** Bounded at 38 significant digits. Values beyond that must be decomposed by the consumer.
- **No composite types:** ARRAY, MAP, RECORD, UNION, OPTIONAL are out of scope for SK-09.
- **No field constraints:** minLength, maximum, required, regex, and similar belong to SK-10 Facets.
- **Deferred automated verification:** All behavioral scenarios are documented in `test-archive/SK-09/SK-09-deferred-tests.md`.
