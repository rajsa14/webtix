/** Handwritten notes never render below 20px, however small their group is scaled. */
export const NOTE_MIN_PX = 20

/** Font size to set inside a group scaled by `scale`, so the note shows at `designSize` or at least 20px. */
export const noteSize = (designSize: number, scale: number) => Math.max(designSize, Math.ceil((NOTE_MIN_PX / scale) * 10) / 10)
