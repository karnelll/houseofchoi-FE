"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import BottomPopup from "@/components/common/popup/BottomPopup";
import PopupButtons from "@/components/common/button/PopupButtons";
import CalendarIcon from "@/asset/icons/calendar-tick.svg";

export type PopupStep = "confirm" | "success" | "duplicate";

interface CalendarAddPopupProps {
  title: string;
  isOpen: boolean;
  step: PopupStep;
  onClose: () => void;
  onConfirm: () => void;
}

export default function CalendarPopup({
  title,
  isOpen,
  step,
  onClose,
  onConfirm,
}: CalendarAddPopupProps) {
  const router = useRouter();

  const goCalendar = () => {
    onClose();
    router.push("/member/calendar");
  };

  const isConfirm = step === "confirm";
  const isSuccess = step === "success";

  return (
    <BottomPopup isOpen={isOpen} onClose={onClose}>
      <div className="relative flex flex-col items-center text-center gap-6 pb-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded hover:bg-bgColor-surface"
          aria-label="닫기"
        >
          <X className="w-5 h-5 text-textColor-sub" />
        </button>

        {isConfirm ? (
          <CalendarIcon className="w-12 h-12 text-brand-normal" />
        ) : (
          <>
            <div className="w-8 h-8 bg-brand rounded-full" />
            <CalendarIcon className="w-12 h-12 text-brand-normal" />
          </>
        )}

        <p className="text-xl font-bold text-textColor-heading text-center leading-relaxed">
          {isConfirm ? (
            <>
              {title} 일정을 <br />
              추가하시겠습니까?
            </>
          ) : isSuccess ? (
            "일정이 추가되었습니다!"
          ) : (
            "이미 등록된 일정입니다!"
          )}
        </p>

        <p
          className={`text-sm text-center ${isConfirm ? "text-textColor-body" : "text-textColor-sub"}`}
        >
          {isConfirm
            ? "추가 후 일정에서 확인해보세요!"
            : "다른 활동도 일정에 추가해보세요!"}
        </p>
        <PopupButtons
          onConfirm={isConfirm ? onConfirm : goCalendar}
          onCancel={onClose}
          confirmLabel={isConfirm ? "네, 좋아요" : "내 일정 보러가기"}
          cancelLabel={isConfirm ? "아뇨, 더 둘러볼래요" : "닫기"}
        />
      </div>
    </BottomPopup>
  );
}
