import Header from '@/components/chat/Header';
import ChatWindow from '@/components/chat/ChatWindow';
import InputBar from '@/components/chat/InputBar';
import HistorySidebar from '@/components/chat/HistorySidebar';
import RightPanel from '@/components/chat/RightPanel';
import CatalogView from '@/components/catalog/CatalogView';
import { useChatStore } from '@/store/chatStore';

const Index = () => {
  const isSidebarPinned = useChatStore((s) => s.isSidebarPinned);
  const isSidebarOpen = useChatStore((s) => s.isSidebarOpen);
  const appMode = useChatStore((s) => s.appMode);
  const showStaticSidebar = isSidebarPinned && isSidebarOpen;

  return (
    <div className="min-h-screen flex flex-col md:h-screen md:overflow-hidden">
      <Header />
      <div className="flex-1 flex min-h-0">
        {appMode === 'gpt' && showStaticSidebar && <HistorySidebar />}
        {appMode === 'gpt' ? (
          <div className="flex-1 flex flex-col min-h-0">
            <ChatWindow />
            <InputBar />
          </div>
        ) : (
          <CatalogView />
        )}
      </div>
      {appMode === 'gpt' && !showStaticSidebar && <HistorySidebar />}
      <RightPanel />
    </div>
  );
};

export default Index;
