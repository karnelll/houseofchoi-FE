import axiosMainInstance from "@/apis/common/axiosMainInstance";
import axiosAiInstance from "@/apis/common/axiosAiInstance";
import { handleApiError } from "@/utils/common/handleApiError";
import type { AxiosResponse } from "axios";
import type { Program, RecommendedProgramResponse } from "@/types/program";

export async function fetchProgramList(): Promise<Program[]> {
  try {
    const res: AxiosResponse<{ success: boolean; data: Program[] }> =
      await axiosMainInstance.get("/v1/program/all");

    if (!res.data.success) {
      throw new Error("프로그램 목록을 불러오지 못했습니다.");
    }

    return res.data.data;
  } catch (error) {
    throw handleApiError(error, "프로그램 목록 조회 중 오류가 발생했습니다.");
  }
}

export async function fetchRecommendedPrograms(
  subCategory?: string,
): Promise<Program[]> {
  try {
    const res: AxiosResponse<RecommendedProgramResponse[]> =
      await axiosAiInstance.get("/recommend", {
        params: subCategory ? { sub_category: subCategory } : {},
      });

    const converted: Program[] = res.data.map((item) => ({
      ...item,
      imageUrl: item.image_url ?? item.imageUrl ?? "",
      centerId: item.center?.id ?? 0,
      centerName: item.center?.name ?? "장소 정보 없음",
      center: item.center,
      tags: item.tags.map((t) => t.name),
    }));

    return converted;
  } catch (error) {
    throw handleApiError(error, "추천 프로그램 조회 중 오류가 발생했습니다.");
  }
}
