import clsx from "clsx";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export default function Card({ children, className, glow }: Props) {
  return (
    <div
      className={clsx(
        "bg-white rounded-3xl p-6",
        glow ? "shadow-glow" : "shadow-card",
        className
      )}
    >
      {children}
    </div>
  );
}
