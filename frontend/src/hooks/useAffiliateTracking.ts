"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const COOKIE_NAME = "affiliate_ref";
const COOKIE_DAYS = 30;

function setCookie(name: string, value: string, days: number) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
}

export function useAffiliateTracking() {
  const searchParams = useSearchParams();
  const [affiliateRef, setAffiliateRef] = useState<string | null>(null);

  useEffect(() => {
    // URL'den ref parametresini oku
    const refFromUrl = searchParams.get("ref");

    if (refFromUrl) {
      // Yeni ref varsa cookie'ye kaydet
      setCookie(COOKIE_NAME, refFromUrl, COOKIE_DAYS);
      setAffiliateRef(refFromUrl);
    } else {
      // URL'de ref yoksa cookie'den oku
      const refFromCookie = getCookie(COOKIE_NAME);
      if (refFromCookie) {
        setAffiliateRef(refFromCookie);
      }
    }
  }, [searchParams]);

  return affiliateRef;
}

export function getAffiliateRef(): string | null {
  return getCookie(COOKIE_NAME);
}

export default useAffiliateTracking;
