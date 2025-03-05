import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};


export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    const urlAPI = import.meta.env.VITE_API_URL

    const isAuthenticated = () => {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return false;
        }
        return true;
      };

    useEffect(() => {
        if(isAuthenticated()){

            const newSocket = io.connect(urlAPI);
            setSocket(newSocket);
            return () => {
                newSocket.disconnect();
            };
        }else{
            return;
        }
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};