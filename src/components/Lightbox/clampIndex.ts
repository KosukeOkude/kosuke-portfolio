    //インデックスが 0 〜 count - 1 の範囲に収まるようにする」負の数字を出さないための計算
    //count一周分
    //index現在のindex
export function clampIndex(index: number, count: number) {
    if (count <= 0) return 0;
    return (((index % count) + count) % count);
}
