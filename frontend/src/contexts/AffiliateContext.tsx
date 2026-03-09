"use client";

import { createContext, useContext, ReactNode, Suspense } from "react";
import { useAffiliateTracking } from "@/hooks/useAffiliateTracking";

interface AffiliateContextType {
  affiliateRef: string | null;
}

const AffiliateContext = createContext<AffiliateContextType>({
  affiliateRef: null,
});

function AffiliateTracker({ children }: { children: ReactNode }) {
  const affiliateRef = useAffiliateTracking();

  return (
    <AffiliateContext.Provider value={{ affiliateRef }}>
      {children}
    </AffiliateContext.Provider>
  );
}

export function AffiliateProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <AffiliateTracker>{children}</AffiliateTracker>
    </Suspense>
  );
}

export function useAffiliate() {
  return useContext(AffiliateContext);
}

export default AffiliateContext;
