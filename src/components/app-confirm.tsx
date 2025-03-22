"use client";

import { Button } from "@/components/ui/button";
import React, { createContext, useCallback, useContext, useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface Options {
  title: string;
  children?: React.ReactNode;
  labels?: {
    confirm?: string;
    cancel?: string;
  };
  onCancel?: () => void;
  onConfirm?: () => void;
  isShowCancel?: boolean;
  isShowConfirm?: boolean;
}

interface ContextType {
  show: (options: Options) => void;
  closeModal: () => void;
}

const Context = createContext<ContextType | undefined>(undefined);

export function AppConfirmProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [modalContent, setModalContent] = useState<Options | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const show = useCallback((options: Options) => {
    setModalContent({
      ...options,
      isShowCancel: options.isShowCancel ?? true,
      isShowConfirm: options.isShowConfirm ?? true,
    });
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setModalContent(null);
  }, []);

  return (
    <Context.Provider value={{ show, closeModal }}>
      {children}
      {modalContent && (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogContent aria-describedby={undefined}>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription asChild>
              {modalContent.children}
            </AlertDialogDescription>
            <AlertDialogFooter>
              {modalContent.isShowCancel && (
                <AlertDialogCancel asChild>
                  <Button variant={"secondary"} onClick={modalContent.onCancel}>
                    {modalContent.labels?.cancel ?? "Cancel"}
                  </Button>
                </AlertDialogCancel>
              )}

              {modalContent.isShowConfirm && (
                <Button
                  variant={"destructive"}
                  onClick={() => {
                    modalContent.onConfirm?.();
                    closeModal();
                  }}
                  type="button"
                >
                  {modalContent.labels?.confirm ?? "Continue"}
                </Button>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </Context.Provider>
  );
}

export function useAppConfirm() {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useAppConfirm must be used within a ModalProvider");
  }
  return context;
}
