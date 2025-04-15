"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  showCloseButton?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  description,
  className,
  showCloseButton = true,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // 모달 외부 클릭 시 닫기
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  // Escape 키 누르면 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // 모달이 열렸을 때 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // 클라이언트 사이드 렌더링 확인
  useEffect(() => {
    setMounted(true);
  }, []);

  // 열고 닫을 때 애니메이션
  useEffect(() => {
    const modal = modalRef.current;
    const overlay = overlayRef.current;
    
    if (!modal || !overlay) return;

    if (isOpen) {
      overlay.classList.remove("opacity-0");
      overlay.classList.add("opacity-100");
      
      modal.classList.remove("opacity-0", "translate-y-4");
      modal.classList.add("opacity-100", "translate-y-0");
    } else {
      overlay.classList.remove("opacity-100");
      overlay.classList.add("opacity-0");
      
      modal.classList.remove("opacity-100", "translate-y-0");
      modal.classList.add("opacity-0", "translate-y-4");
    }
  }, [isOpen]);

  if (!mounted) return null;

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity duration-300 opacity-0"
      ref={overlayRef}
      onClick={handleOverlayClick}
    >
      <div className="absolute inset-0 bg-gray-900/50" />
      
      <div
        ref={modalRef}
        className={cn(
          "relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-lg transition-all duration-300 transform opacity-0 translate-y-4",
          className
        )}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        <div className="p-6">
          {title && <h2 className="text-xl font-semibold mb-2">{title}</h2>}
          {description && <p className="text-gray-600 mb-4">{description}</p>}
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
