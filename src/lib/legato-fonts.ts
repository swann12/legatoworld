/** Explicit loads start during the flower animation, including unused italic. */
export async function waitForLegatoFonts(): Promise<void> {
  await Promise.all([
    document.fonts.load('400 16px "Instrument Serif"'),
    document.fonts.load('italic 400 16px "Instrument Serif"'),
    document.fonts.load('400 16px "Instrument Sans"'),
  ]);
  await document.fonts.ready;
}