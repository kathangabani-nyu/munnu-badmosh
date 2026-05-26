import { TEMPLATE_PHOTOS } from "./stages";

type FigureKind = "cody" | "may" | "codyMay";

const LABELS: Record<FigureKind, string> = {
  cody: "Cody",
  may: "May",
  codyMay: "Cody and May",
};

export function FigurePhoto({
  kind,
  className = "",
}: {
  kind: FigureKind;
  className?: string;
}) {
  const media = TEMPLATE_PHOTOS[kind];

  return (
    <div className={`figure-photo figure-photo-${kind} ${className}`} aria-label={LABELS[kind]}>
      {media ? <img src={media.src} alt="" draggable={false} /> : <div className="figure-photo-empty" />}
    </div>
  );
}
