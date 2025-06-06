"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useSignup } from "@/hooks/auth/useSignup";
import Step1_Name from "./Step1_Name";
import Step2_Birthday from "./Step2_Birthday";
import Step3_Carrier from "./Step3_Carrier";
import Step4_PhoneNumber from "./Step4_PhoneNumber";
import Step5_VerificationCode from "./Step5_VerificationCode";
import ConsentPopup from "../popup/ConsentPopup";
import BottomButton from "../../common/button/BottomButton";
import { sendSMS } from "@/apis/auth/auth";
import Toast from "@/components/common/Toast";
import { handleApiError } from "@/utils/common/handleApiError";

interface StepContainerProps {
  onNext?: () => void;
}

export default function StepContainer({ onNext }: StepContainerProps) {
  const { step, errors, phoneNumber, setStep, name, birthday, carrier } =
    useAuthStore();
  const router = useRouter();
  const { handleSignUp } = useSignup();
  const [showConsent, setShowConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const isFormValid = Object.values(errors).every((err) => !err);
  const requiredFields = { name, birthday, carrier, phoneNumber };
  const isAllInputsFilled = Object.values(requiredFields).every((value) =>
    Boolean(value),
  );

  const handleBottomClick = () => {
    if (step === 4) {
      if (errors.phoneNumber) {
        setError(errors.phoneNumber);
        return;
      }
      setShowConsent(true);
    }
  };

  const handleConsentAgree = async () => {
    setLoading(true);
    try {
      await sendSMS(phoneNumber, router);
      setShowConsent(false);
      if (onNext) {
        onNext();
      } else {
        setStep(5);
      }
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "인증번호 전송에 실패했습니다.",
        router,
      );
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = (verifiedCode: string) => {
    console.log("✅ 인증 성공:", verifiedCode);
    handleSignUp({
      code: verifiedCode,
      onSuccess: (status: "EXISTING_USER" | "NEW_USER") => {
        console.log("가입 상태:", status);

        if (status === "EXISTING_USER") {
          router.replace("/member");
        } else {
          localStorage.setItem("signupComplete", "true");
          router.replace("/member/complete");
        }
      },
      onError: (msg: string) => {
        setError(msg);
      },
    });
  };

  const renderTitle = () => {
    switch (step) {
      case 1:
        return "이름을 입력해주세요";
      case 2:
        return "주민등록번호 7자리를\n입력해주세요";
      case 3:
        return "통신사를 선택해주세요";
      case 4:
        return "휴대폰 번호를 입력해주세요";
      case 5:
        return "인증번호를 입력해주세요";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen w-full bg-bgColor-default px-0 flex flex-col gap-10 pb-[80px]">
      <h2 className="text-2xl font-semibold text-textColor-heading whitespace-pre-line">
        {renderTitle()}
      </h2>

      {step === 5 ? (
        <Step5_VerificationCode
          code={code}
          setCode={setCode}
          error={error}
          setError={setError}
          onSuccess={handleSuccess}
          loading={loading}
        />
      ) : (
        <>
          {step >= 4 && <Step4_PhoneNumber />}
          {step >= 3 && <Step3_Carrier />}
          {step >= 2 && <Step2_Birthday />}
          {step >= 1 && <Step1_Name />}

          <BottomButton
            onClick={handleBottomClick}
            disabled={step < 4 || loading || !isFormValid || !isAllInputsFilled}
          >
            {loading ? "처리 중..." : "인증번호 받기"}
          </BottomButton>

          {showConsent && (
            <ConsentPopup
              isOpen={showConsent}
              onCancel={() => setShowConsent(false)}
              onConfirm={handleConsentAgree}
              loading={loading}
            />
          )}
        </>
      )}

      {error && <Toast message={error} onClose={() => setError("")} />}
    </div>
  );
}
