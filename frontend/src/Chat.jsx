import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: `💁‍♀️ 안녕하세요! 저는 NoeveOrBit 피부과의 온라인 상담사입니다.

궁금하신 피부 고민이 있다면 언제든지 편하게 말씀해 주세요. 😊

💡 예시 질문:
- "현재 진행하는 이벤트는 뭐가 있나요?"
- "피부과 리프팅 시술 종류가 궁금해요."
- "기미·잡티는 어떤 방식으로 개선되나요?"
- "진료 시간과 위치 알려주세요."`
    }
  ]);

  const chatEndRef = useRef(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isComposing, setIsComposing] = useState(false);

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async (customMessage) => {
    const messageToSend = customMessage || input;
    if (!messageToSend.trim()) return;

    const newMessages = [...messages, { role: 'user', text: messageToSend }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const gptMessages = newMessages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      const res = await axios.post('https://chat-demo-bugv.onrender.com/chat', {
        messages: gptMessages
      });

      const reply = res.data.reply;
      setMessages([...newMessages, { role: 'bot', text: reply }]);
    } catch {
      setMessages([
        ...newMessages,
        { role: 'bot', text: '⚠️ 죄송합니다. 오류가 발생했습니다. 다시 시도해 주세요.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen p-6 relative bg-cover bg-center"
      style={{ backgroundImage: 'url("/chat-bg.jpg")' }}
    >
      <div className="absolute inset-0 bg-white/80 z-0" />

      <div
        className="relative max-w-2xl w-full mx-auto rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
        style={{
          backgroundImage: 'url("/chat-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10 p-6 bg-white/80">
          <h2 className="text-2xl font-bold mb-4 text-center text-pink-600">
            💬 NoeveOrBit 피부과 온라인 상담실
          </h2>

          <div className="space-y-3 mb-4 max-h-[450px] overflow-y-auto">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-xl text-sm whitespace-pre-wrap shadow ${
                    msg.role === 'user'
                      ? 'bg-pink-600 text-white rounded-br-none'
                      : 'bg-white text-black border border-gray-300 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-sm text-gray-500 italic">입력 중입니다...</div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="flex justify-center mb-4">
            <a
              href="https://booking.naver.com/booking/13/bizes/820793"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md font-semibold shadow-md"
            >
              📅 NoeveOrBit 피부과 예약하기
            </a>
          </div>

          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isComposing) sendMessage();
              }}
              placeholder="궁금한 점을 입력하세요..."
              className="flex-1 px-4 py-2 rounded-md border border-gray-300 text-black shadow-sm"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading}
              className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition font-semibold"
            >
              {loading ? '...' : '전송'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
