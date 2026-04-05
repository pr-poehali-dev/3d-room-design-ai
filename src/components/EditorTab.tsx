import Icon from "@/components/ui/icon";

interface EditorTabProps {
  onNavigateToGallery: () => void;
}

export default function EditorTab({ onNavigateToGallery }: EditorTabProps) {
  return (
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
              onClick={onNavigateToGallery}
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
  );
}
