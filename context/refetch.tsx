"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

// Definisi tipe data
interface RefetchContextType {
  handleRefetch: (id: string) => void;
  refetchMap: Record<string, number>;
}

interface RefetchProviderProps {
  children: ReactNode;
}

const RefetchContext = createContext<RefetchContextType | undefined>(undefined);

export const RefetchProvider: React.FC<RefetchProviderProps> = ({
  children,
}) => {
  const [refetchMap, setRefetchMap] = useState<Record<string, number>>({});

  const handleRefetch = useCallback((id: string) => {
    setRefetchMap((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  }, []);

  return (
    <RefetchContext.Provider value={{ handleRefetch, refetchMap }}>
      {children}
    </RefetchContext.Provider>
  );
};

export const useRefetch = (): RefetchContextType => {
  const context = useContext(RefetchContext);
  if (!context) {
    throw new Error("useRefetxch must be used within a RefetchProvider");
  }
  return context;
};
