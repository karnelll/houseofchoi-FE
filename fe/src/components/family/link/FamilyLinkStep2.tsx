"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import FamilyCompletedMessage from "@/components/family/common/CompletedMessage";
import BottomButton from "@/components/common/button/BottomButton";
import { verifyRelation } from "@/apis/family/link";
import CompletionNotice from "@/components/personality/analysis/CompletionNotice";
import Toast from "@/components/common/Toast";
import FamilyHeader from "@/components/family/common/FamilyHeader";
import Image from "next/image";

interface FamilyLinkStep2Props {
  relation: "parent" | "child";
  onBack: () => void;
}

export default function FamilyLinkStep2({
  relation,
  onBack,
}: FamilyLinkStep2Props) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [userStatus, setUserStatus] = useState<
    "NEW_USER" | "EXISTING_USER" | "NEED_PERSONALITY" | null
  >(null);
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const clearCode = () => {
    setCode("");
  };

  const handleNext = async () => {
    if (!code) return;

    const targetRole = relation === "parent" ? "자녀" : "부모";

    try {
      const res = await verifyRelation(code, targetRole);
      console.log("가족 연동 응답:", res.data);

      if (res.data.success) {
        const status = res.data.userStatus;
        console.log("유저 상태:", status);

        if (status === "NEW_USER") {
          console.log("새로운 유저 - 성향 분석 페이지로 이동");
          setUserStatus("NEW_USER");
        } else {
          // 기존 유저의 경우 성향 분석 완료 여부 확인
          const isPersonalityCompleted =
            localStorage.getItem("personalityCompleted") === "true";
          console.log("성향 분석 완료 여부:", isPersonalityCompleted);

          if (!isPersonalityCompleted) {
            console.log("성향 분석 미완료 - complete 페이지로 이동");
            setUserStatus("NEED_PERSONALITY");
          } else {
            console.log("성향 분석 완료 - 메인 페이지로 이동");
            setUserStatus("EXISTING_USER");
          }
        }
      } else {
        setError(res.data.message || "연동에 실패했습니다.");
      }
    } catch (err) {
      console.error("가족 연동 에러:", err);

      if (axios.isAxiosError(err)) {
        const data = err.response?.data as { code?: string; message?: string };

        const code = data?.code;

        switch (code) {
          case "SELF_RELATION_NOT_ALLOWED":
            setToastMessage("자기 자신과는 가족으로 연동할 수 없어요.");
            break;
          case "MULTIPLE_PHONE_ERROR":
            setToastMessage("동일한 번호로는 여러 가족을 연동할 수 없어요.");
            break;
          case "RELATED_USER_ALREADY_CONNECTED":
            setToastMessage(
              "입력한 고유번호는 이미 다른 가족과 연동되어 있어요.",
            );
            break;
          default:
            setToastMessage(data?.message || "예상치 못한 오류가 발생했어요.");
            break;
        }
      } else {
        setToastMessage("네트워크 오류가 발생했어요. 다시 시도해주세요.");
      }
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push("/member/family");
    }
  };

  if (userStatus === "NEW_USER") {
    console.log("새로운 유저 완료 메시지 표시");
    return (
      <FamilyCompletedMessage
        redirectTo="/member/personality"
        delayMs={3000}
        message="연동이 완료되었어요 🎉"
        description="이제 성향 분석을 시작할게요!"
      />
    );
  }

  if (userStatus === "NEED_PERSONALITY") {
    console.log("성향 분석 필요 메시지 표시");
    return (
      <FamilyCompletedMessage
        redirectTo="/member/personality"
        delayMs={3000}
        message="연동이 완료되었어요 🎉"
        description="이제 성향 분석을 시작할게요!"
      />
    );
  }

  if (userStatus === "EXISTING_USER") {
    return (
      <CompletionNotice
        version="familyLinked"
        redirectTo="/member"
        delayMs={3000}
      />
    );
  }

  return (
    <div className="relative flex flex-col min-h-screen px-6 pt-4 pb-20 bg-bgColor-default">
      <FamilyHeader onBack={handleBack} />
      <div className="flex flex-col justify-center flex-1 gap-8 mt-16">
        <p className="text-xl font-semibold text-textColor-heading text-left">
          {relation === "parent" ? "자녀" : "부모"}의 고유 번호를 입력해주세요
        </p>

        <div className="flex flex-col gap-6">
          <div className="relative">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="고유번호 입력"
              className="w-full h-[65px] px-4 pr-10 text-lg border-2 border-gray-300 focus:border-brand-normal focus:outline-none rounded-xl"
            />
            {code && (
              <button
                onClick={clearCode}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <Image
                  src="/images/deleteicon.svg"
                  alt="입력값 지우기"
                  width={18}
                  height={18}
                />
              </button>
            )}
          </div>

          {error && (
            <p className="text-danger-50 text-sm text-center">{error}</p>
          )}
        </div>
      </div>

      <BottomButton onClick={handleNext} disabled={!code}>
        연동하기
      </BottomButton>

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      )}
    </div>
  );
}
