import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/authContext';
import { Complaint } from '@/types/complaint';
import { createRef, useCallback, useEffect, useState } from 'react';
import { MessageList, MessageType } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useTranslations } from 'next-intl';

enum UserType {
  CLIENT = 'client',
  SUPPORT = 'support',
}

interface MessageData {
  userType: string;
  date: Date;
  content: string;
  complaintId?: string;
  userId?: number;
}

interface MessageResponse {
  type: string;
  data: MessageData | MessageData[];
}

export function Chat({ complaint }: { complaint: Complaint | null }) {
  const t = useTranslations('Complaints.Chat');
  const { user } = useAuth();
  const messageListReferance = createRef();
  const [messageHistory, setMessageHistory] = useState<MessageType[]>([]);
  const [messageText, setMessageText] = useState<string>('');
  const [placeholderText, setPlaceholderText] = useState<string>('');

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket('ws://localhost:3000/ws');

  const getUserType = (userType: string) => (['client', 'courier'].includes(userType) ? UserType.CLIENT : UserType.SUPPORT);

  useEffect(() => {
    const placeholderTextMap = {
      [ReadyState.UNINSTANTIATED]: t('ConnexionUninitialized'),
      [ReadyState.CONNECTING]: t('ConnexionEstablishing'),
      [ReadyState.OPEN]: t('ConnexionEstablished'),
      [ReadyState.CLOSING]: t('ConnexionClosing'),
      [ReadyState.CLOSED]: t('ConnexionClosed'),
      default: t('UnknownConnectionState'),
    };
    setPlaceholderText(placeholderTextMap[readyState] ?? placeholderTextMap.default);
  }, [readyState, t]);

  const userTypeToFloat = useCallback(
    (userType: UserType) => {
      const isClient = getUserType(user?.role as string) === UserType.CLIENT;

      return {
        [UserType.CLIENT]: isClient ? 'right' : 'left',
        [UserType.SUPPORT]: isClient ? 'left' : 'right',
      }[userType];
    },
    [user],
  );

  const userTypeToTitle = useCallback(
    (userType: UserType) =>
      ({
        [UserType.CLIENT]: 'User',
        [UserType.SUPPORT]: 'Support',
      })[userType],
    [],
  );

  const buildMessageObj = useCallback(
    (message: string, userType: UserType, date?: Date): MessageType => {
      const roleType = getUserType(user?.role as string);
      return {
        id: Math.random(),
        text: message,
        date: date ?? new Date(),
        type: 'text',
        position: userTypeToFloat(userType),
        title: userTypeToTitle(userType),
        focus: false,
        titleColor: '#000',
        forwarded: false,
        replyButton: false,
        removeButton: false,
        status: 'sent',
        notch: roleType === userType,
        retracted: false,
      };
    },
    [user, userTypeToFloat, userTypeToTitle],
  );

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      setTimeout(() => {
        sendJsonMessage({ type: 'join', data: { complaintId: complaint?.id } });
      }, 100);
    }

    return () => {
      setMessageHistory([]);
    };
  }, [sendJsonMessage, readyState, complaint]);

  useEffect(() => {
    if (lastJsonMessage == null) return;
    if ((lastJsonMessage as MessageResponse).type === 'join') {
      const lastMessage = (lastJsonMessage as MessageResponse).data as MessageData[];
      const messages = lastMessage.map(message => {
        const messageUserType = getUserType(message.userType);
        return buildMessageObj(message.content, messageUserType, new Date(message.date));
      });
      setMessageHistory(messages);
    } else if ((lastJsonMessage as MessageResponse).type === 'chat') {
      const lastMessage = (lastJsonMessage as MessageResponse).data as MessageData;
      const lastMessageUserType = getUserType(lastMessage.userType);
      const supportMessageObj = buildMessageObj(lastMessage.content, lastMessageUserType);
      setMessageHistory(prev => prev.concat(supportMessageObj));
    } else {
      console.log('Unknown message type');
    }
  }, [lastJsonMessage, buildMessageObj]);

  const handleSendMessage = useCallback(() => {
    if (messageText.length === 0) return;
    const userMessageObj = buildMessageObj(messageText, getUserType(user?.role as string));
    setMessageText('');

    sendJsonMessage({
      type: 'chat',
      data: {
        userType: user?.role as string,
        complaintId: complaint?.id,
        userId: complaint?.user.id,
        content: userMessageObj.text,
        date: userMessageObj.date,
      },
    });
  }, [sendJsonMessage, messageText, buildMessageObj, complaint, user]);

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col h-0 grow shrink basis-auto">
        <MessageList
          referance={messageListReferance}
          className="flex flex-col text-black h-full"
          lockable={true}
          toBottomHeight={'100%'}
          dataSource={messageHistory}
        />
      </div>
      <div className="flex items-center border-y p-2">
        <Input
          placeholder={complaint?.status === 'resolved' ? t('ResolvedComplaintMessage') : placeholderText}
          onKeyDown={e => {
            if (e.shiftKey && e.key === 'Enter') {
              return;
            } else if (e.key === 'Enter') {
              if (readyState !== ReadyState.OPEN) {
                return;
              }
              handleSendMessage();
            }
          }}
          onChange={e => setMessageText(e.target.value)}
          disabled={readyState !== ReadyState.OPEN || complaint?.status === 'resolved'}
          value={messageText}
        />
        <Button variant="link" onClick={handleSendMessage} disabled={readyState !== ReadyState.OPEN || complaint?.status === 'resolved'}>
          {t('Send')}
        </Button>
      </div>
    </div>
  );
}
