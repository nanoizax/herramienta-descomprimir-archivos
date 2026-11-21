import JSZip from "jszip";

export type ArchiveKind = "zip" | "rar" | "unsupported";

export function detectArchiveKind(file: File): ArchiveKind {
  const lower = file.name.toLowerCase();
  if (lower.endsWith(".zip") || file.type === "application/zip") return "zip";
  if (
    lower.endsWith(".rar") ||
    file.type === "application/x-rar-compressed" ||
    file.type === "application/vnd.rar"
  ) {
    return "rar";
  }
  return "unsupported";
}

export interface ArchiveEntry {
  name: string;
  size: number;
  getContent: () => Promise<Uint8Array>;
}

async function listZip(file: File): Promise<ArchiveEntry[]> {
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const entries: ArchiveEntry[] = [];

  zip.forEach((relativePath, zipEntry) => {
    if (zipEntry.dir) return;
    entries.push({
      name: relativePath,
      // JSZip no expone un getter publico de tamano; _data es interno pero
      // estable hace anios y es la forma habitual de leerlo sin descomprimir
      // el archivo entero solo para mostrar el peso en la lista.
      size: (zipEntry as unknown as { _data?: { uncompressedSize?: number } })._data
        ?.uncompressedSize ?? 0,
      getContent: () => zipEntry.async("uint8array"),
    });
  });

  return entries;
}

async function listRar(file: File): Promise<ArchiveEntry[]> {
  const { createExtractorFromData } = await import("node-unrar-js");
  const wasmUrl = (await import("node-unrar-js/esm/js/unrar.wasm?url")).default;
  const wasmBinary = await fetch(wasmUrl).then((r) => r.arrayBuffer());

  const data = await file.arrayBuffer();
  const extractor = await createExtractorFromData({ wasmBinary, data });

  const extracted = extractor.extract();
  const entries: ArchiveEntry[] = [];

  for (const arcFile of extracted.files) {
    if (arcFile.fileHeader.flags.directory) continue;
    const content = arcFile.extraction;
    entries.push({
      name: arcFile.fileHeader.name,
      size: arcFile.fileHeader.unpSize,
      getContent: async () => content ?? new Uint8Array(),
    });
  }

  return entries;
}

export async function listArchive(file: File): Promise<ArchiveEntry[]> {
  const kind = detectArchiveKind(file);
  if (kind === "zip") return listZip(file);
  if (kind === "rar") return listRar(file);
  throw new Error("unsupported-format");
}

/** Empaqueta las entradas ya leidas en un unico .zip para descargar todo junto. */
export async function bundleAsZip(entries: ArchiveEntry[]): Promise<Blob> {
  const zip = new JSZip();
  for (const entry of entries) {
    zip.file(entry.name, await entry.getContent());
  }
  return zip.generateAsync({ type: "blob" });
}
