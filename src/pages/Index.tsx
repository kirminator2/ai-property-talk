import Header from '@/components/chat/Header';
import ChatWindow from '@/components/chat/ChatWindow';
import InputBar from '@/components/chat/InputBar';
import HistorySidebar from '@/components/chat/HistorySidebar';
import RightPanel from '@/components/chat/RightPanel';
import { useChatStore } from '@/store/chatStore';

const Index = () => {
  const isSidebarPinned = useChatStore((s) => s.isSidebarPinned);
  const isSidebarOpen = useChatStore((s) => s.isSidebarOpen);
  const showStaticSidebar = isSidebarPinned && isSidebarOpen;

  return (
    <div className="min-h-screen flex flex-col md:h-screen md:overflow-hidden">
      <Header />
      <div className="flex-1 flex min-h-0">
        {showStaticSidebar && <HistorySidebar />}
        <div className="flex-1 flex flex-col min-h-0">
          <ChatWindow />
          <InputBar />
        </div>
      </div>
      {!showStaticSidebar && <HistorySidebar />}
      <RightPanel />
    </div>
  );
};

export default Index;
