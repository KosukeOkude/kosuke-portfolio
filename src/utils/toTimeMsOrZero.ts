/**
 * 並び替えなどで使う「日時 → 数値（ミリ秒）」への単純な変換。
 *
 * - `new Date(value)` に委ねてパースし、`getTime()` の戻りを使う。
 * - **Invalid Date** のとき `getTime()` は `NaN` となる。`Number.isFinite(ms)` で弾き、
 *   この関数は **`0`（1970-01-01 00:00:00 UTC）を返す**。
 * - タイムゾーンは **`Date` の仕様どおり**（文字列形式によっては実装依存の解釈がありうる）。
 *
 * `0` は「欠損・不正な日付をソートキー上で同じ塊に寄せる」ためのフォールバックであり、
 * 「その瞬間が Unix エポックである」とは限らない。
 */
export function toTimeMsOrZero(value: string | number | Date): number {
    const ms = new Date(value).getTime();
    return Number.isFinite(ms) ? ms : 0;
  }