import Icon from "@/components/ui/icon";

export default function ExportTab() {
  return (
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
  );
}
