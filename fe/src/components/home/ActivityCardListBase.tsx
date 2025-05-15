"use client";

import { useState, useCallback, useMemo } from "react";
import ActivityCard from "./ActivityCard";
import CalendarAddPopup from "@/components/calendar/popup/CalendarAddPopup";
import LoginGuidePopup from "@/components/auth/popup/LoginGuidePopup";
import ActivityInfoPopup from "@/components/home/popup/ActivityInfoPopup";
import { Program } from "@/types/program";
import { useAuth } from "@/hooks/auth/useAuth";

type PopupStep = "confirm" | "success" | "duplicate";

interface Props {
  programs: Program[];
  isLoading: boolean;
  error: string | null;
  onReload: () => void;
}

export default function ActivityCardListBase({
  programs,
  isLoading,
  error,
  onReload,
}: Props) {
  const { isGuest } = useAuth();

  const [popupOpen, setPopupOpen] = useState(false);
  const [popupStep, setPopupStep] = useState<PopupStep>("confirm");
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [infoProgram, setInfoProgram] = useState<Program | null>(null);

  const uniquePrograms = useMemo(() => {
    const map = new Map<string, Program>();
    const duplicates: Program[] = [];

    for (const p of programs) {
      const key = `${p.id}-${p.centerId}`;
      if (map.has(key)) {
        duplicates.push(p);
      } else {
        map.set(key, p);
      }
    }

    return Array.from(map.values());
  }, [programs]);

  const handleAddClick = useCallback(
    (program: Program) => {
      if (isGuest) {
        setShowLoginPopup(true);
        return;
      }
      setSelectedProgram(program);
      setPopupStep("confirm");
      setPopupOpen(true);
    },
    [isGuest],
  );

  const handleCalendarAdd = useCallback(async (programId: number) => {
    const { registerSchedule } = await import("@/apis/schedule/schedule");
    try {
      const success = await registerSchedule(programId);
      setPopupStep(success ? "success" : "duplicate");
    } catch {
      setPopupStep("duplicate");
    }
  }, []);

  return (
    <section className="flex flex-col items-center gap-5">
      {isLoading && (
        <div className="py-10">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-brand-normal" />
        </div>
      )}

      {!isLoading && error && (
        <div className="py-5 text-center text-textColor-error">
          <p>{error}</p>
          <button onClick={onReload} className="mt-2 btn-primary">
            다시 시도
          </button>
        </div>
      )}

      {!isLoading && !error && uniquePrograms.length === 0 && (
        <p className="py-10 text-textColor-sub">표시할 활동이 없습니다.</p>
      )}

      {!isLoading &&
        !error &&
        uniquePrograms.map((p) => (
          <ActivityCard
            key={`${p.id}-${p.centerId}`}
            imageUrl={p.imageUrl || "/images/placeholder.svg"}
            title={p.name}
            location={p.centerName}
            onAddClick={() => handleAddClick(p)}
            onMoreClick={() => setInfoProgram(p)}
          />
        ))}

      {!isLoading && !error && uniquePrograms.length > 0 && (
        <p className="mb-40 mt-12 text-center text-lg text-textColor-disabled">
          어르심
        </p>
      )}

      {selectedProgram && (
        <CalendarAddPopup
          title={selectedProgram.name}
          isOpen={popupOpen}
          step={popupStep}
          onClose={() => setPopupOpen(false)}
          onConfirm={() => handleCalendarAdd(selectedProgram.id)}
        />
      )}

      <LoginGuidePopup
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
      />

      {infoProgram && (
        <ActivityInfoPopup
          program={{
            ...infoProgram,
            tags: infoProgram.tags.map((tag) => ({ name: tag })),
          }}
          onClose={() => setInfoProgram(null)}
          onAddClick={() => handleAddClick(infoProgram)}
        />
      )}
    </section>
  );
}
