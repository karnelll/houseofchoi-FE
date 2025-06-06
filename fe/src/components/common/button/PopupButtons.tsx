"use client";

interface PopupButtonsProps {
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

export default function PopupButtons({
  onConfirm,
  onCancel,
  confirmLabel = "확인",
  cancelLabel = "취소",
}: PopupButtonsProps) {
  return (
    <div className="w-full flex flex-col items-center gap-3">
      <button
        onClick={onConfirm}
        className="w-full h-[58px] rounded-2xl bg-brand-normal text-white text-2xl font-semibold font-pretendard hover:bg-brand-hover active:bg-brand-active"
      >
        {confirmLabel}
      </button>

      <button
        onClick={onCancel}
        className="h-[44px] px-2 text-lg font-pretendard text-grayscale-40 underline hover:text-grayscale-60"
      >
        {cancelLabel}
      </button>
    </div>
  );
}
