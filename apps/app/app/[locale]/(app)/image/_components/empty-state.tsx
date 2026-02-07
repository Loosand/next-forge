const ImageSparkleIcon = () => (
  <svg
    className="size-24"
    fill="none"
    viewBox="0 0 96 96"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Image frame */}
    <rect
      className="fill-primary/20 stroke-primary"
      height="56"
      rx="8"
      strokeWidth="3"
      width="56"
      x="12"
      y="20"
    />
    {/* Mountain */}
    <path className="fill-primary" d="M20 64L32 48L44 64H20Z" />
    <path className="fill-primary/70" d="M36 64L52 40L60 64H36Z" />
    {/* Sun */}
    <circle className="fill-primary" cx="52" cy="36" r="6" />

    {/* Magic wand */}
    <rect
      className="fill-primary"
      height="32"
      rx="2"
      transform="rotate(15 58 12)"
      width="6"
      x="58"
      y="12"
    />

    {/* Sparkles */}
    <path
      className="fill-primary"
      d="M76 16L78 20L82 22L78 24L76 28L74 24L70 22L74 20L76 16Z"
    />
    <path
      className="fill-primary/70"
      d="M84 28L85.5 31L89 32.5L85.5 34L84 37L82.5 34L79 32.5L82.5 31L84 28Z"
    />
    <path
      className="fill-primary/50"
      d="M72 36L73 38L75 39L73 40L72 42L71 40L69 39L71 38L72 36Z"
    />
  </svg>
);

export const EmptyState = () => (
  <div className="flex h-full flex-1 flex-col items-center justify-center gap-4 px-4">
    <ImageSparkleIcon />
    <h1 className="font-bold text-4xl uppercase tracking-wider">Nano Banana</h1>
    <p className="text-center text-muted-foreground">
      Create stunning, high-aesthetic images in seconds
    </p>
  </div>
);
