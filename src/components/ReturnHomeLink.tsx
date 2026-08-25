import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

type Props = {
  children: ReactNode;
  className?: string;
};

export function ReturnHomeLink({ children, className }: Props) {
  return (
    <Link
      to="/"
      hash="opening"
      resetScroll
      hashScrollIntoView={{ behavior: "instant", block: "start" }}
      className={className}
    >
      {children}
    </Link>
  );
}
