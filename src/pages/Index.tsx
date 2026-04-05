import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";

const GALLERY_ITEMS = [
  {
    id: 1,
    title: "Архитектурная форма",
    format: "GLTF",
    date: "03 апр 2026",
    polys: "24 800",
    img: "https://cdn.poehali.dev/projects/174f67bc-63fb-4f8e-85da-90095a4e6471/files/09591a87-21ec-4562-939c-e011e33d5cfd.jpg",
  },
  {
    id: 2,
    title: "Интерьер / план",
    format: "OBJ",
    date: "02 апр 2026",
    polys: "18 340",
    img: "https://cdn.poehali.dev/projects/174f67bc-63fb-4f8e-85da-90095a4e6471/files/5260b802-d350-45d5-815f-e57a875c4635.jpg",
  },
  {
    id: 3,
    title: "Продуктовая модель",
    format: "FBX",
    date: "01 апр 2026",
    polys: "9 120",
    img: "https://cdn.poehali.dev/projects/174f67bc-63fb-4f8e-85da-90095a4e6471/files/33590aa9-fa58-4be5-a336-bb4127c72b58.jpg",
  },
];

const FORMATS = ["GLTF", "OBJ", "FBX"];

const NAV_ITEMS = [
  { label: "Генерация", icon: "Sparkles", id: "generate" },
  { label: "Галерея", icon: "LayoutGrid", id: "gallery" },
  { label: "Редактор", icon: "Sliders", id: "editor" },
  { label: "Экспорт", icon: "Download", id: "export" },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState("generate");
  const [draggingSlot, setDraggingSlot] = useState<number | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<(string | null)[]>([null, null, null, null]);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFormat, setSelectedFormat] = useState("GLTF");
  const [dims, setDims] = useState({ w: "", h: "", d: "" });
  const [selectedModel, setSelectedModel] = useState<number | null>(null);
  const fileRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const SLOT_LABELS = ["Спереди", "Сзади", "Сбоку", "Сверху"];

  const handleDrop = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDraggingSlot(null);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setUploadedFiles((prev) => prev.map((f, i) => i === idx ? url : f));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedFiles((prev) => prev.map((f, i) => i === idx ? url : f));
    }
  };

  const removeFile = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    setUploadedFiles((prev) => prev.map((f, i) => i === idx ? null : f));
  };

  const handleGenerate = () => {
    setGenerating(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setGenerating(false);
          return 100;
        }
        return p + Math.random() * 12;
      });
    }, 200);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 border border-primary/60 rotate-45 flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-primary" />
          </div>
          <span className="font-mono text-sm font-medium tracking-widest text-foreground/90 uppercase">
            Form3D
          </span>
          <span className="font-mono text-xs text-muted-foreground/50 ml-1">v0.1</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="font-mono text-xs text-muted-foreground">AI Ready</span>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <nav className="w-16 border-r border-border flex flex-col items-center py-6 gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
              className={`w-10 h-10 rounded flex flex-col items-center justify-center gap-0.5 transition-all duration-200
                ${activeTab === item.id
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
            >
              <Icon name={item.icon} size={16} />
              <span className="text-[8px] font-mono uppercase tracking-wider leading-none opacity-70">
                {item.label.slice(0, 3)}
              </span>
            </button>
          ))}
        </nav>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto">

          {/* GENERATE TAB */}
          {activeTab === "generate" && (
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
                    {([
                      { label: "Фронт", hint: "спереди" },
                      { label: "Бок", hint: "сбоку" },
                      { label: "Сверху", hint: "сверху" },
                      { label: "Деталь", hint: "крупный план" },
                    ] as const).map((slot, i) => (
                      <div key={i} className="relative group">
                        <div
                          onClick={() => fileRefs[i].current?.click()}
                          onDragOver={(e) => { e.preventDefault(); setDraggingSlot(i); }}
                          onDragLeave={() => setDraggingSlot(null)}
                          onDrop={(e) => handleDrop(e, i)}
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
                            onChange={(e) => handleFileInput(e, i)}
                          />
                        </div>
                        {uploadedFiles[i] && (
                          <button
                            onClick={(e) => { e.stopPropagation(); removeFile(i); }}
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
                            onChange={(e) => setDims((d) => ({ ...d, [key]: e.target.value }))}
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
                          onClick={() => setSelectedFormat(f)}
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
                    onClick={handleGenerate}
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
          )}

          {/* GALLERY TAB */}
          {activeTab === "gallery" && (
            <div className="max-w-5xl mx-auto">
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <h1 className="text-2xl font-light text-foreground tracking-tight mb-1">
                    Галерея моделей
                  </h1>
                  <p className="text-sm text-muted-foreground font-light">
                    {GALLERY_ITEMS.length} сохранённых вариантов
                  </p>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono text-muted-foreground border border-border rounded hover:text-foreground hover:border-border/60 transition-all">
                  <Icon name="SlidersHorizontal" size={12} />
                  Фильтр
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {GALLERY_ITEMS.map((item, i) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedModel(item.id)}
                    className={`group bg-card rounded border cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-0.5
                      ${selectedModel === item.id ? "border-primary/50" : "border-border hover:border-border/60"}
                    `}
                  >
                    <div className="aspect-video overflow-hidden relative">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-2 right-2">
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-background/80 text-primary border border-primary/30 backdrop-blur-sm">
                          {item.format}
                        </span>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-foreground">{item.title}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-muted-foreground">{item.polys} полигонов</span>
                        <span className="font-mono text-xs text-muted-foreground">{item.date}</span>
                      </div>
                      <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button className="flex-1 py-1.5 text-xs font-mono rounded bg-primary text-primary-foreground flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-colors">
                          <Icon name="Download" size={11} />
                          Скачать
                        </button>
                        <button className="px-2.5 py-1.5 text-xs font-mono rounded border border-border text-muted-foreground hover:text-foreground hover:border-border/60 transition-all">
                          <Icon name="Eye" size={11} />
                        </button>
                        <button className="px-2.5 py-1.5 text-xs font-mono rounded border border-border text-muted-foreground hover:text-foreground hover:border-border/60 transition-all">
                          <Icon name="Pencil" size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EDITOR TAB */}
          {activeTab === "editor" && (
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h1 className="text-2xl font-light text-foreground tracking-tight mb-1">
                  Редактор модели
                </h1>
                <p className="text-sm text-muted-foreground font-light">
                  Кастомизация и доработка выбранной модели
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Viewport */}
                <div className="lg:col-span-2 aspect-video bg-card rounded border border-border flex items-center justify-center relative overflow-hidden">
                  <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none">
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                  <div className="relative text-center">
                    <div className="w-16 h-16 border border-border rounded rotate-12 mx-auto mb-4 flex items-center justify-center">
                      <Icon name="Box" size={28} className="text-muted-foreground/40 -rotate-12" />
                    </div>
                    <p className="text-sm text-muted-foreground">Выберите модель из галереи</p>
                    <button
                      onClick={() => setActiveTab("gallery")}
                      className="mt-3 text-xs font-mono text-primary underline underline-offset-2"
                    >
                      Открыть галерею →
                    </button>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col gap-3">
                  {[
                    { label: "Масштаб", icon: "Maximize2", value: "100%" },
                    { label: "Поворот X", icon: "RotateCcw", value: "0°" },
                    { label: "Поворот Y", icon: "RefreshCw", value: "0°" },
                    { label: "Детализация", icon: "Layers", value: "Средняя" },
                  ].map(({ label, icon, value }) => (
                    <div key={label} className="p-3 bg-card rounded border border-border flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon name={icon} size={13} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{label}</span>
                      </div>
                      <span className="font-mono text-xs text-foreground">{value}</span>
                    </div>
                  ))}

                  <div className="p-3 bg-card rounded border border-border">
                    <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
                      Материал
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {["#C0C0C0", "#8B7355", "#1C1C1C", "#E8E0D0"].map((color) => (
                        <button
                          key={color}
                          className="aspect-square rounded border border-border hover:border-primary/50 transition-colors"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* EXPORT TAB */}
          {activeTab === "export" && (
            <div className="max-w-2xl mx-auto">
              <div className="mb-8">
                <h1 className="text-2xl font-light text-foreground tracking-tight mb-1">
                  Экспорт моделей
                </h1>
                <p className="text-sm text-muted-foreground font-light">
                  Скачайте модель в нужном формате для любой программы
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    fmt: "GLTF / GLB",
                    icon: "Globe",
                    desc: "Blender, Three.js, Unreal Engine 5, Babylon.js",
                    size: "2.4 МБ",
                    badge: "Рекомендован",
                  },
                  {
                    fmt: "OBJ + MTL",
                    icon: "Box",
                    desc: "Blender, Maya, 3ds Max, Cinema 4D, ZBrush",
                    size: "3.1 МБ",
                    badge: null,
                  },
                  {
                    fmt: "FBX",
                    icon: "Package",
                    desc: "Unity, Unreal Engine, Maya, 3ds Max, MotionBuilder",
                    size: "4.8 МБ",
                    badge: null,
                  },
                  {
                    fmt: "STL",
                    icon: "Printer",
                    desc: "3D-печать, прототипирование, CAD-системы",
                    size: "1.9 МБ",
                    badge: null,
                  },
                ].map(({ fmt, icon, desc, size, badge }) => (
                  <div
                    key={fmt}
                    className="p-4 bg-card rounded border border-border flex items-center justify-between group transition-all duration-200 hover:-translate-y-0.5 hover:border-border/60"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded border border-border flex items-center justify-center bg-secondary group-hover:border-primary/40 transition-colors">
                        <Icon name={icon} size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-medium text-foreground">{fmt}</span>
                          {badge && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                              {badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-muted-foreground">{size}</span>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-secondary text-foreground text-xs font-mono border border-border
                        hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200">
                        <Icon name="Download" size={12} />
                        Скачать
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-card rounded border border-border">
                <div className="flex items-start gap-3">
                  <Icon name="Info" size={14} className="text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Модели сохраняются в вашей галерее 30 дней. Для постоянного хранения скачайте файл
                    или подключите облачное хранилище.
                  </p>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Status bar */}
      <footer className="border-t border-border px-6 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-muted-foreground/50">Form3D Studio</span>
          <span className="font-mono text-xs text-muted-foreground/30">·</span>
          <span className="font-mono text-xs text-muted-foreground/50">GPU: Ready</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-muted-foreground/50">3 модели в галерее</span>
          <div className="w-1 h-1 rounded-full bg-primary/50" />
          <span className="font-mono text-xs text-muted-foreground/50">AI v2.1</span>
        </div>
      </footer>
    </div>
  );
}