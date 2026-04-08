import Header from '@/components/chat/Header';
import ChatWindow from '@/components/chat/ChatWindow';
import InputBar from '@/components/chat/InputBar';
import HistorySidebar from '@/components/chat/HistorySidebar';
import RightPanel from '@/components/chat/RightPanel';

const Index = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 flex flex-col min-h-0">
        <ChatWindow />
        <InputBar />
      </div>
      <HistorySidebar />
      <RightPanel />
    </div>
  );
};

export default Index;
