"use client";

import { useRouter } from "next/navigation";
import BottomPopup from "@/components/common/popup/BottomPopup";
import PopupButtons from "@/components/common/button/PopupButtons";
import { Calendar, X } from "lucide-react";

interface FamilyLinkPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FamilyLinkPopup({
  isOpen,
  onClose,
}: FamilyLinkPopupProps) {
  const router = useRouter();

  const handleAddFamily = () => {
    onClose();
    router.replace("/member/family");
  };

  return (
    <BottomPopup isOpen={isOpen} onClose={onClose}>
      <div className="relative flex flex-col items-center text-center w-full max-w-[327px] min-h-[330px] px-6 pt-5 pb-4 mx-auto justify-center gap-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded hover:bg-bgColor-surface"
          aria-label="닫기"
        >
          <X className="w-6 h-6 text-iconColor-sub" />
        </button>

        <Calendar className="w-10 h-10 text-brand-normal" />

        <h2 className="text-2xl font-semibold text-textColor-heading">
          계정에 가족을 추가해보세요
        </h2>

        <p className="text-base text-textColor-sub leading-relaxed whitespace-pre-line">
          가족을 추가하면 함께{"\n"}일정을 공유할 수 있어요!
        </p>

        <PopupButtons
          onConfirm={handleAddFamily}
          onCancel={onClose}
          confirmLabel="가족 추가하기"
          cancelLabel="건너뛰기"
        />
      </div>
    </BottomPopup>
  );
}
