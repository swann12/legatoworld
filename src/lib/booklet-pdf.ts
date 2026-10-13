import type { PracticalState } from "./practical-store";

/** Browser-only invocation; loaded on the explicit download action. */
export async function downloadBooklet(draft: PracticalState["bookletDraft"], selectedTexts: string[], selectedMusic: string[]) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "landscape", format: "a4", unit: "mm" });
  const fontResponse = await fetch("/fonts/InstrumentSerif-Regular.ttf");
  if (!fontResponse.ok) throw new Error("La police du livret n’a pas pu être chargée.");
  const bytes = new Uint8Array(await fontResponse.arrayBuffer());
  let binary = "";
  for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
  doc.addFileToVFS("InstrumentSerif.ttf", btoa(binary));
  doc.addFont("InstrumentSerif.ttf", "InstrumentSerif", "normal");
  doc.setFont("InstrumentSerif");
  const color = getComputedStyle(document.documentElement).getPropertyValue("--lg-deep").trim();
  doc.setTextColor(color);
  doc.setFontSize(28);
  doc.text(draft.name || "En souvenir", 74, 146, { align: "center" });
  doc.setFontSize(13); doc.text(draft.dates, 74, 158, { align: "center" });
  if (draft.photoUrl) {
    const image = new Image(); image.crossOrigin = "anonymous"; image.src = draft.photoUrl;
    await image.decode();
    const canvas = document.createElement("canvas"); canvas.width = 900; canvas.height = 900;
    const ctx = canvas.getContext("2d");
    if (ctx) { const scale = Math.max(900 / image.width, 900 / image.height); ctx.drawImage(image, (900 - image.width * scale) / 2, (900 - image.height * scale) / 2, image.width * scale, image.height * scale); doc.addImage(canvas.toDataURL("image/jpeg"), "JPEG", 44, 65, 60, 60); }
  }
  let y = 26;
  const paragraph = (text: string, size = 14) => {
    if (!text) return;
    doc.setFontSize(size);
    const lines: string[] = doc.splitTextToSize(text, 112);
    for (const line of lines) {
      if (y > 182) { doc.addPage(); y = 26; }
      doc.text(line, 164, y); y += size === 20 ? 9 : 6;
    }
    y += 8;
  };
  paragraph(draft.intro || "Bienvenue. Merci d’être là.");
  paragraph("Le déroulé", 20);
  paragraph(draft.program || "Accueil\nTextes et musique\nHommage\nRecueillement");
  if (selectedTexts.length) { paragraph("Lectures", 20); paragraph(selectedTexts.join("\n")); }
  if (selectedMusic.length) { paragraph("Musiques", 20); paragraph(selectedMusic.join("\n")); }
  paragraph(draft.closing || "Merci d’avoir partagé ce moment.");
  doc.save("livret-ceremonie.pdf");
}
