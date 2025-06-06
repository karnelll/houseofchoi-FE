import React from "react";

interface ChatBubbleProps {
  type: "user" | "bot";
  text?: string;
}

const ChatBubble = ({ type, text = "" }: ChatBubbleProps) => {
  const isUser = type === "user";

  const renderTextWithLineBreaks = (text: string) =>
    text.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < text.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));

  return (
    <div
      className={`
        px-4 py-2 
        rounded-2xl 
        min-w-[40px] max-w-[100%] 
        text-[20px] font-pretendard
        ${isUser ? "bg-brand-normal text-textColor-white" : "bg-bgColor-default text-black"}
      `}
    >
      {renderTextWithLineBreaks(text)}
    </div>
  );
};

export default ChatBubble;
