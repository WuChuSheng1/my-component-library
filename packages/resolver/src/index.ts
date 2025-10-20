export interface ComponentResolverResult {
  importName: string;
  path: string;
  sideEffects?: string | string[];
}

export type ComponentResolver = (
  name: string,
) => ComponentResolverResult | undefined;

function toKebabCase(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

// Map components starting with St to @my-wcs/components
export function MyWcsResolver(options?: {
  importStyle?: boolean | "css";
}): ComponentResolver {
  const importStyle = options?.importStyle ?? true;
  return (name) => {
    if (!name.startsWith("St")) return undefined;
    const importName = name;
    const compKebab = toKebabCase(name.replace(/^St/, ""));
    const sideEffects = importStyle
      ? [
          // components package preserves per-component css under say-hello/style.css
          `@my-wcs/components/dist/es/${compKebab}/style.css`,
        ]
      : undefined;
    return { importName, path: "@my-wcs/components", sideEffects };
  };
}
