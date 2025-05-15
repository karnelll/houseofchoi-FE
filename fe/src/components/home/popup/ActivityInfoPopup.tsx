"use client";

import { useEffect, useState } from "react";
import {
  Map as KakaoMap,
  MapMarker,
  ZoomControl,
  Loader,
} from "react-kakao-maps-sdk";
import { X } from "lucide-react";
import BottomPopup from "@/components/common/popup/BottomPopup";
import PopupButtons from "@/components/common/button/PopupButtons";
import type { UnifiedProgram } from "@/types/program";
import { formatProgramSchedule } from "@/utils/program/formatProgramSchedule";

interface ActivityInfoPopupProps {
  program: UnifiedProgram;
  onClose: () => void;
  onAddClick: () => void;
}

export default function ActivityInfoPopup({
  program,
  onClose,
  onAddClick,
}: ActivityInfoPopupProps) {
  const lat = program.center.latitude;
  const lng = program.center.longitude;

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    const kakaoApiKey = process.env.NEXT_PUBLIC_KAKAO_API_KEY;

    if (!kakaoApiKey) {
      setMapError("지도를 불러올 수 없습니다!");
      return;
    }

    const loader = new Loader({
      appkey: kakaoApiKey,
      libraries: ["services"],
    });

    loader
      .load()
      .then(() => setIsMapLoaded(true))
      .catch(() => {
        setMapError(
          "지도를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.",
        );
      });
  }, []);

  return (
    <BottomPopup isOpen={true} onClose={onClose}>
      <div className="fixed inset-0 z-50 bg-white z-50 overflow-y-auto px-4 pt-16 pb-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1"
          aria-label="닫기"
        >
          <X className="w-6 h-6 text-textColor-sub" />
        </button>

        <div className="w-full h-[250px] rounded-xl overflow-hidden border border-borderColor-default mt-2">
          {mapError ? (
            <div className="flex items-center justify-center w-full h-full text-sm text-red-400">
              {mapError}
            </div>
          ) : isMapLoaded ? (
            <KakaoMap
              center={{ lat, lng }}
              level={3}
              style={{ width: "100%", height: "100%" }}
            >
              <MapMarker position={{ lat, lng }} />
              <ZoomControl position={kakao.maps.ControlPosition.RIGHT} />
            </KakaoMap>
          ) : (
            <div className="flex items-center justify-center w-full h-full text-sm text-gray-400">
              지도를 불러오는 중...
            </div>
          )}
        </div>

        <div className="mt-6 space-y-2 text-base text-textColor-body font-pretendard">
          <h2 className="text-xl font-semibold text-textColor-heading">
            {program.name}
          </h2>
          <p className="text-sm text-textColor-sub">{program.center.name}</p>
          <p>{program.center.address}</p>
          <p>전화번호: {program.center.tel}</p>
          <p>이용 시간: {formatProgramSchedule(program)}</p>
          <p>
            요금:{" "}
            {program.price !== undefined
              ? `${program.price.toLocaleString()}원(3개월)`
              : "가격 정보 없음"}
          </p>
        </div>

        <div className="mt-8">
          <PopupButtons
            onConfirm={onAddClick}
            onCancel={onClose}
            confirmLabel="일정 추가하기"
            cancelLabel="닫기"
          />
        </div>
      </div>
    </BottomPopup>
  );
}
