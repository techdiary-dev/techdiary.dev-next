"use client";
import { CircleX } from "lucide-react";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { useTranslation } from "@/i18n/use-translation";

interface Options {
  title: string;
  description?: string;
  type?: "warning" | "error" | "success" | "info";
  isShowCancel?: boolean;
  isShowConfirm?: boolean;
}

interface ContextType {
  show: (options: Options) => void;
  closeModal: () => void;
}

const Context = createContext<ContextType | undefined>(undefined);

export function AppAlertProvider({ children }: { children: React.ReactNode }) {
  const { _t } = useTranslation();
  const [modalContent, setModalContent] = useState<Options | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const show = useCallback((options: Options) => {
    const type = options.type ?? "error";
    setModalContent({
      ...options,
      type,
    });
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setModalContent(null);
  }, []);

  const renderIcon = useMemo(() => {
    switch (modalContent?.type) {
      case "error":
        return <CircleX className="size-20 text-destructive" />;
      case "warning":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-20 text-warning"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        );
      case "success":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-20 text-success"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        );
      case "info":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-20"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
            />
          </svg>
        );
      default:
        return null;
    }
  }, [modalContent?.type]);

  return (
    <Context.Provider value={{ show, closeModal }}>
      {children}
      {modalContent && (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogContent aria-describedby={undefined}>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {/* {modalContent.title ?? "Are you sure?"} */}
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              <div className="flex flex-col gap-2 items-center">
                {renderIcon}
                <h3 className="text-xl font-semibold">{modalContent.title}</h3>
                {modalContent.description && (
                  <p className="text-sm text-muted-foreground">
                    {modalContent?.description}
                  </p>
                )}
              </div>
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel className="mx-auto">
                {_t("Close")}
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </Context.Provider>
  );
}

export function useAppAlert() {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useAppAlert must be used within a AppAlertProvider");
  }
  return context;
}
