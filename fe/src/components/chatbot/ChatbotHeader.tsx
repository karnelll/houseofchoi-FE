"use client";

import type { NextPage } from "next";
import { useState } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/common/button/BackButton";
import ChatbotExitPopup from "@/components/chatbot/popup/ChatbotExitPopup";

const ChatbotHeader: NextPage = () => {
  const router = useRouter();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPopupOpen(true);
  };

  const handleConfirmExit = () => {
    router.push("/member");
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className="w-full relative bg-bgColor-default h-14 md:h-16 flex items-center px-2 md:px-4 text-textColor-heading font-pretendard">
      <BackButton onClick={handleBackClick} className="mr-1" />

      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 font-medium text-[21px] md:text-2xl">
        배우다
      </div>

      <ChatbotExitPopup
        isOpen={isPopupOpen}
        onConfirm={handleConfirmExit}
        onClose={handleClosePopup}
      />
    </div>
  );
};

export default ChatbotHeader;
