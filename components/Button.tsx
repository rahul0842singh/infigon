import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "ghost";
  size?: "sm" | "md";
};

export function Button({
  className,
  variant = "solid",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition focus:outline-none focus:ring-2 focus:ring-black/20 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-white/20",
        variant === "solid" &&
          "bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90",
        variant === "ghost" &&
          "border border-black/10 bg-white/60 text-black hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15",
        size === "sm" ? "h-9 px-3 text-sm" : "h-10 px-4 text-sm",
        className
      )}
      {...props}
    />
  );
}
