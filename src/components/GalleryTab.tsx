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

interface GalleryTabProps {
  selectedModel: number | null;
  onSelectModel: (id: number) => void;
}

export default function GalleryTab({ selectedModel, onSelectModel }: GalleryTabProps) {
  return (
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
        {GALLERY_ITEMS.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectModel(item.id)}
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
  );
}
