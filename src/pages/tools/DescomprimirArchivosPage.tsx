import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Download, File as FileIcon } from "lucide-react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import FileDropZone from "@/components/tools/FileDropZone";
import { Button } from "@/components/ui/button";
import {
  bundleAsZip,
  detectArchiveKind,
  listArchive,
  type ArchiveEntry,
} from "@/lib/tools/extractArchive";
import { formatBytes } from "@/lib/tools/compressFile";

const MAX_ENTRIES_SHOWN = 300;

const DescomprimirArchivosPage = () => {
  const { t } = useTranslation("tools");

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState<ArchiveEntry[] | null>(null);
  const [bundling, setBundling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (selected: File) => {
    setError(null);
    setEntries(null);

    if (detectArchiveKind(selected) === "unsupported") {
      setError(t("ui.error_unsupported_archive"));
      return;
    }

    setFile(selected);
    setLoading(true);
    try {
      const list = await listArchive(selected);
      setEntries(list);
    } catch (err) {
      const reason = (err as { reason?: string })?.reason;
      setError(
        reason === "ERAR_MISSING_PASSWORD" || reason === "ERAR_BAD_PASSWORD"
          ? t("ui.error_archive_password")
          : t("ui.error_archive_generic")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAll = async () => {
    if (!entries || !file) return;
    setBundling(true);
    try {
      const blob = await bundleAsZip(entries);
      const base = file.name.replace(/\.[^.]+$/, "");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${base}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError(t("ui.error_archive_generic"));
    } finally {
      setBundling(false);
    }
  };

  const handleDownloadOne = async (entry: ArchiveEntry) => {
    const content = await entry.getContent();
    const blob = new Blob([content]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = entry.name.split("/").pop() || entry.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null);
    setEntries(null);
    setError(null);
  };

  return (
    <ToolPageLayout toolId="descomprimir-archivos">
      <div className="border border-neutral-800 rounded-xl p-6 md:p-8">
        {!file ? (
          <FileDropZone
            accept=".zip,.rar,application/zip,application/x-rar-compressed,application/vnd.rar"
            label={t("ui.upload_label_archive")}
            hint={t("ui.upload_hint_archive")}
            onFile={handleFile}
            toolId="descomprimir-archivos"
          />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-400 truncate max-w-[60%]">{file.name}</span>
              <Button
                variant="outline"
                onClick={reset}
                className="rounded-full px-6 border-neutral-700 text-white bg-transparent hover:bg-white/10"
              >
                {t("ui.reset_button_file")}
              </Button>
            </div>

            {loading && <p className="text-neutral-400 text-sm">{t("ui.processing")}</p>}
            {error && <p className="text-red-400 text-sm">{error}</p>}

            {entries && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 text-sm">
                    {t("ui.archive_file_count", { count: entries.length })}
                  </span>
                  <Button
                    onClick={handleDownloadAll}
                    isLoading={bundling}
                    loadingText={t("ui.processing")}
                    className="bg-white text-black hover:bg-white/80 rounded-full px-6"
                  >
                    <Download className="w-4 h-4" />
                    {t("ui.download_all_button")}
                  </Button>
                </div>

                <div className="border border-neutral-800 rounded-lg divide-y divide-neutral-800 max-h-[28rem] overflow-y-auto">
                  {entries.slice(0, MAX_ENTRIES_SHOWN).map((entry, i) => (
                    <div key={i} className="flex items-center justify-between gap-3 px-4 py-2.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileIcon className="w-4 h-4 text-neutral-500 shrink-0" />
                        <span className="text-sm text-neutral-300 truncate">{entry.name}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-neutral-500">{formatBytes(entry.size)}</span>
                        <button
                          onClick={() => handleDownloadOne(entry)}
                          className="text-neutral-400 hover:text-white transition-colors"
                          aria-label={t("ui.download_button")}
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {entries.length > MAX_ENTRIES_SHOWN && (
                  <p className="text-neutral-500 text-xs">
                    {t("ui.archive_truncated_notice", {
                      shown: MAX_ENTRIES_SHOWN,
                      total: entries.length,
                    })}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
};

export default DescomprimirArchivosPage;
