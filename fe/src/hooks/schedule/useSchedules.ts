import { useState, useEffect, useCallback, useRef } from "react";
import { fetchProgramList } from "@/apis/main/program";
import { getScheduleByDay, deleteSchedule } from "@/apis/schedule/calendar";
import { formatTime } from "@/utils/schedule/calendar";
import type { UnifiedProgram } from "@/types/program";
import type { ScheduleItem } from "@/types/schedule";

export function useSchedules(day: string) {
  const [data, setData] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const seqRef = useRef(0);

  const load = useCallback(async (d: string) => {
    const seq = ++seqRef.current;
    setLoading(true);
    setError(null);

    try {
      const [programs, schedules] = await Promise.all([
        fetchProgramList(), // ✅ already UnifiedProgram[]
        getScheduleByDay(d),
      ]);

      if (seq !== seqRef.current) return;

      const map = new Map<number, UnifiedProgram>();
      programs.forEach((p) => map.set(p.id, p));

      const items = schedules.map<ScheduleItem>((s) => {
        const p = map.get(s.programId);
        return {
          id: s.scheduleId,
          period: "2분기(4~6월)",
          title: s.name,
          time: p
            ? `${formatTime(p.startTime)} ~ ${formatTime(p.endTime)}`
            : "-",
          location: p?.center.name ?? "-",
        };
      });

      setData(items);
    } catch {
      if (seq === seqRef.current) {
        setError("일정을 불러오는 데 실패했습니다.");
      }
    } finally {
      if (seq === seqRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void load(day);
  }, [day, load]);

  const remove = async (scheduleId: number) => {
    await deleteSchedule(scheduleId);
    setData((prev) => prev.filter((s) => s.id !== scheduleId));
  };

  return { data, loading, error, remove, reload: load };
}
