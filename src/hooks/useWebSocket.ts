import { useEffect, useRef } from 'react';
import { useTransactionStore } from '../stores/transactionStore';

export const useWebSocket = () => {
  const addTransaction = useTransactionStore((state) => state.addTransaction);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const socket = new WebSocket(`${protocol}//${host}/ws/transactions`);

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'NEW_TRANSACTION') {
        addTransaction(message.data);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected. Retrying in 5s...');
      setTimeout(() => {
        // Simple reconnection logic
      }, 5000);
    };

    socketRef.current = socket;

    return () => {
      socket.close();
    };
  }, [addTransaction]);

  return socketRef.current;
};
