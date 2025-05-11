import Image from "next/image";
import ChatBubble from "@/components/chatbot/messages/ChatBubble";
import ButtonGroup from "@/components/chatbot/ButtonGroup";
import ScheduleConfirm from "@/components/chatbot/ScheduleConfirm";
import { formatTime } from "@/lib/chatbot/formatTime";
import type { FC } from "react";
import type { Message } from "@/types/chatbot";

interface MessageGroupProps {
  sender: string;
  profileUrl: string;
  isUser?: boolean;
  items: Message[];
  onButtonClick?: (value: string, label: string) => void;
}

const hm = (iso: string) => formatTime(iso);

const MessageGroup: FC<MessageGroupProps> = ({
  sender,
  profileUrl,
  isUser,
  items,
  onButtonClick,
}) => {
  const showAvatar =
    !isUser &&
    !["button", "schedule-confirm", "activity"].includes(items[0].type) &&
    !!(items[0].profileUrl || profileUrl);

  return (
    <div className="flex flex-col gap-1">
      {showAvatar && (
        <div className="flex items-start -mb-[2px]">
          <Image
            src={items[0].profileUrl || profileUrl}
            alt={sender}
            width={36}
            height={36}
            className="rounded-full object-cover mb-0"
          />
        </div>
      )}

      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
        {items.map((msg, idx) => {
          const isFirst = idx === 0;
          const prevMsg = items[idx - 1];
          const nextMsg = items[idx + 1];

          const nextSameOwner = nextMsg && msg.isUser === nextMsg.isUser;
          const nextSameHM =
            nextMsg && hm(msg.timestamp) === hm(nextMsg.timestamp);

          const shouldShowTime =
            msg.type !== "button" &&
            (!nextMsg ||
              !nextSameOwner ||
              !nextSameHM ||
              nextMsg.type === "button");

          const shouldAddTopMargin =
            !isFirst &&
            (msg.isUser !== prevMsg?.isUser ||
              (prevMsg?.type === "button" && msg.type !== "text"));

          const marginTopClass = (() => {
            if (showAvatar && isFirst) return "mt-1";
            if (prevMsg && prevMsg.isUser !== msg.isUser) return "mt-8";
            if (prevMsg && prevMsg.isUser === msg.isUser) return "mt-4";
            return shouldAddTopMargin ? "mt-4" : "mt-6";
          })();

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.isUser ? "items-end" : "items-start"} ${marginTopClass}`}
            >
              {msg.type === "schedule-confirm" ? (
                <div
                  className={`flex items-end gap-3 mb-4 ${
                    msg.isUser ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <ScheduleConfirm
                    onConfirm={() => onButtonClick?.("yes", "예")}
                    onCancel={() => onButtonClick?.("no", "아니요")}
                  />
                  {shouldShowTime && (
                    <span className="text-sm text-gray-400 whitespace-nowrap">
                      {formatTime(msg.timestamp)}
                    </span>
                  )}
                </div>
              ) : msg.type === "button" && msg.buttons ? (
                <ButtonGroup
                  buttons={msg.buttons}
                  onClick={(value, label) => onButtonClick?.(value, label)}
                />
              ) : (
                <div
                  className={`flex items-end gap-2 ${
                    msg.isUser ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <ChatBubble
                    text={msg.content}
                    type={msg.isUser ? "user" : "bot"}
                  />
                  {shouldShowTime && (
                    <span className="text-sm text-gray-400 whitespace-nowrap">
                      {formatTime(msg.timestamp)}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MessageGroup;
