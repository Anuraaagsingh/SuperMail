'use client';

import { useState, useRef, useEffect } from 'react';
import { AutoSizer, List, WindowScroller } from 'react-virtualized';
import { EmailListItem } from './EmailListItem';
import { useMail } from '@/hooks/useMail';

interface EmailListProps {
  label?: string;
  searchQuery?: string;
}

export function EmailList({ label = 'INBOX', searchQuery }: EmailListProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { messages, isLoading, error, hasMore, loadMore } = useMail({
    label,
    maxResults: 50,
    q: searchQuery,
  });
  
  const listRef = useRef<List | null>(null);
  
  // Reset list position when label or search changes
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToPosition(0);
    }
    setSelectedId(null);
  }, [label, searchQuery]);
  
  const handleSelect = (id: string) => {
    setSelectedId(id);
  };
  
  const handleScroll = ({ scrollTop, scrollHeight, clientHeight }: { scrollTop: number, scrollHeight: number, clientHeight: number }) => {
    // Load more when scrolled to bottom
    if (scrollTop + clientHeight >= scrollHeight - 300 && hasMore && !isLoading) {
      loadMore();
    }
  };
  
  if (isLoading && messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 rounded-full border-4 border-t-blue-500 animate-spin"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        Error: {error}
      </div>
    );
  }
  
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-12 w-12 mb-2" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
          />
        </svg>
        <p>No messages found</p>
      </div>
    );
  }
  
  const rowRenderer = ({ index, key, style }: { index: number, key: string, style: React.CSSProperties }) => {
    const message = messages[index];
    return (
      <div key={key} style={style}>
        <EmailListItem
          message={message}
          isSelected={selectedId === message.id}
          onSelect={handleSelect}
        />
      </div>
    );
  };
  
  return (
    <div className="h-full">
      <WindowScroller>
        {({ height, isScrolling, onChildScroll, scrollTop }) => (
          <AutoSizer disableHeight>
            {({ width }) => (
              <List
                ref={listRef}
                autoHeight
                height={height || 800}
                width={width}
                isScrolling={isScrolling}
                onScroll={handleScroll}
                overscanRowCount={5}
                rowCount={messages.length}
                rowHeight={90}
                rowRenderer={rowRenderer}
                scrollTop={scrollTop}
              />
            )}
          </AutoSizer>
        )}
      </WindowScroller>
      
      {isLoading && messages.length > 0 && (
        <div className="flex justify-center py-4">
          <div className="h-6 w-6 rounded-full border-2 border-t-blue-500 animate-spin"></div>
        </div>
      )}
    </div>
  );
}
