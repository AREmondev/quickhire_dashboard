"use client";
import { useCallback } from "react";

// Simple toast using browser alert as fallback — replace with a toast library if desired
export function useErrorToast() {
    return useCallback((msg: string) => {
        console.error("[Dashboard error]", msg);
    }, []);
}

export function useSuccessToast() {
    return useCallback((msg: string) => {
        console.log("[Dashboard success]", msg);
    }, []);
}
