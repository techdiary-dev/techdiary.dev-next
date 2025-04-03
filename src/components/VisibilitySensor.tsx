"use client";

import { LoaderIcon } from "lucide-react";
import React, { useEffect } from "react";

interface VisibilitySensorProps {
  visible?: boolean;
  onLoadmore?: () => void;
}

const VisibilitySensor: React.FC<VisibilitySensorProps> = ({
  visible = true,
  onLoadmore,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onLoadmore?.();
          }
        });
      },
      {
        root: null, // Uses viewport as root
        rootMargin: "0px",
        threshold: 1,
      }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [ref, onLoadmore]);

  if (!visible) return null;
  return (
    <div ref={ref} className="flex h-10 w-full items-center justify-center">
      <LoaderIcon className="animate-spin" />
    </div>
  );
};

export default VisibilitySensor;
