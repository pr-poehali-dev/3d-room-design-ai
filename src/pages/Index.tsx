import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";
import GenerateTab from "@/components/GenerateTab";
import GalleryTab from "@/components/GalleryTab";
import EditorTab from "@/components/EditorTab";
import ExportTab from "@/components/ExportTab";

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

  const removeFile = (idx: number) => {
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
          {activeTab === "generate" && (
            <GenerateTab
              uploadedFiles={uploadedFiles}
              draggingSlot={draggingSlot}
              generating={generating}
              progress={progress}
              selectedFormat={selectedFormat}
              dims={dims}
              fileRefs={fileRefs}
              onDrop={handleDrop}
              onDragOver={(idx) => setDraggingSlot(idx)}
              onDragLeave={() => setDraggingSlot(null)}
              onFileInput={handleFileInput}
              onRemoveFile={removeFile}
              onGenerate={handleGenerate}
              onFormatChange={setSelectedFormat}
              onDimsChange={setDims}
            />
          )}

          {activeTab === "gallery" && (
            <GalleryTab
              selectedModel={selectedModel}
              onSelectModel={setSelectedModel}
            />
          )}

          {activeTab === "editor" && (
            <EditorTab onNavigateToGallery={() => setActiveTab("gallery")} />
          )}

          {activeTab === "export" && (
            <ExportTab />
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
