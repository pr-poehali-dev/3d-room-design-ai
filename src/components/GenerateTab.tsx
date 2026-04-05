import { useRef, useState } from "react";
import Icon from "@/components/ui/icon";

const FORMATS = ["GLTF", "OBJ", "FBX"];

interface GenerateTabProps {
  uploadedFiles: (string | null)[];
  draggingSlot: number | null;
  generating: boolean;
  progress: number;
  selectedFormat: string;
  dims: { w: string; h: string; d: string };
  fileRefs: React.RefObject<HTMLInputElement>[];
  onDrop: (e: React.DragEvent, idx: number) => void;
  onDragOver: (idx: number) => void;
  onDragLeave: () => void;
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>, idx: number) => void;
  onRemoveFile: (idx: number) => void;
  onGenerate: () => void;
  onFormatChange: (f: string) => void;
  onDimsChange: (dims: { w: string; h: string; d: string }) => void;
}

export default function GenerateTab({
  uploadedFiles,
  draggingSlot,
  generating,
  progress,
  selectedFormat,
  dims,
  fileRefs,
  onDrop,
  onDragOver,
  onDragLeave,
  onFileInput,
  onRemoveFile,
  onGenerate,
  onFormatChange,
  onDimsChange,
}: GenerateTabProps) {
  const SLOT_LABELS = [
    { label: "Фронт", hint: "спереди" },
    { label: "Бок", hint: "сбоку" },
    { label: "Сверху", hint: "сверху" },
    { label: "Деталь", hint: "крупный план" },
  ] as const;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-light text-foreground tracking-tight mb-1">
          Генерация 3D модели
        </h1>
        <p className="text-sm text-muted-foreground font-light">
          Загрузите фото объекта и укажите размеры — AI создаст 3D модель
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Upload zone — 4 slots */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Фото объекта
            </label>
            <span className="font-mono text-xs text-muted-foreground/50">
              {uploadedFiles.filter(Boolean).length} / 4
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {SLOT_LABELS.map((slot, i) => (
              <div key={i} className="relative group">
                <div
                  onClick={() => fileRefs[i].current?.click()}
                  onDragOver={(e) => { e.preventDefault(); onDragOver(i); }}
                  onDragLeave={onDragLeave}
                  onDrop={(e) => onDrop(e, i)}
                  className={`relative aspect-square rounded border-2 border-dashed cursor-pointer transition-all duration-200 overflow-hidden
                    ${draggingSlot === i ? "border-primary bg-primary/5" : uploadedFiles[i] ? "border-border/40" : "border-border hover:border-primary/40 hover:bg-secondary/20"}
                  `}
                >
                  {uploadedFiles[i] ? (
                    <img
                      src={uploadedFiles[i]!}
                      alt={slot.label}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
                      <Icon name="ImagePlus" size={18} className={`transition-colors ${draggingSlot === i ? "text-primary" : "text-muted-foreground/50"}`} />
                      <span className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-wider">{slot.label}</span>
                      <span className="text-[9px] text-muted-foreground/30">{slot.hint}</span>
                    </div>
                  )}
                  <input
                    ref={fileRefs[i]}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onFileInput(e, i)}
                  />
                </div>
                {uploadedFiles[i] && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onRemoveFile(i); }}
                    className="absolute top-1 right-1 w-5 h-5 rounded bg-background/80 border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:border-destructive"
                  >
                    <Icon name="X" size={10} className="text-foreground" />
                  </button>
                )}
                {uploadedFiles[i] && (
                  <span className="absolute bottom-1 left-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-background/70 text-muted-foreground backdrop-blur-sm">
                    {slot.label}
                  </span>
                )}
              </div>
            ))}
          </div>
          <p className="mt-2 text-[10px] font-mono text-muted-foreground/40 text-center">
            Перетащите или кликните · JPG, PNG, WEBP · до 20 МБ каждое
          </p>
        </div>

        {/* Parameters */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">
              Размеры (мм)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: "w", label: "Ш" },
                { key: "h", label: "В" },
                { key: "d", label: "Г" },
              ].map(({ key, label }) => (
                <div key={key} className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground">
                    {label}
                  </span>
                  <input
                    type="number"
                    placeholder="0"
                    value={dims[key as keyof typeof dims]}
                    onChange={(e) => onDimsChange({ ...dims, [key]: e.target.value })}
                    className="w-full pl-6 pr-2 py-2.5 bg-input border border-border rounded text-right text-sm font-mono text-foreground focus:outline-none focus:border-primary/60 transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">
              Формат экспорта
            </label>
            <div className="flex gap-2">
              {FORMATS.map((f) => (
                <button
                  key={f}
                  onClick={() => onFormatChange(f)}
                  className={`flex-1 py-2 text-xs font-mono rounded border transition-all duration-200
                    ${selectedFormat === f
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-input text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">
              Детализация
            </label>
            <div className="flex gap-2">
              {["Низкая", "Средняя", "Высокая"].map((q, i) => (
                <button
                  key={q}
                  className={`flex-1 py-2 text-xs font-mono rounded border transition-all duration-200
                    ${i === 1
                      ? "bg-secondary text-foreground border-border"
                      : "bg-input text-muted-foreground border-border hover:text-foreground"
                    }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onGenerate}
            disabled={generating}
            className="mt-auto w-full py-3 rounded bg-primary text-primary-foreground font-medium text-sm tracking-wide
              hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed
              flex items-center justify-center gap-2"
          >
            {generating ? (
              <>
                <Icon name="Loader2" size={14} className="animate-spin" />
                Генерация {Math.min(Math.round(progress), 100)}%
              </>
            ) : (
              <>
                <Icon name="Sparkles" size={14} />
                Сгенерировать модель
              </>
            )}
          </button>

          {generating && (
            <div className="h-0.5 bg-secondary rounded overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 rounded"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          { icon: "Camera", text: "Фото с нейтральным фоном даёт лучший результат" },
          { icon: "Ruler", text: "Точные размеры повышают качество масштабирования" },
          { icon: "Layers", text: "Несколько ракурсов улучшают детализацию модели" },
        ].map(({ icon, text }, i) => (
          <div key={i} className="flex items-start gap-3 p-3 bg-card rounded border border-border">
            <Icon name={icon} size={14} className="text-primary mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
