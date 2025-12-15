import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

interface UseAutoScrollProps<T extends HTMLElement> {
    isExpanded: boolean;
    ref: any; // Relaxed for build stability
    parentRef?: any; // Optional parent to focus on close
    enabled?: boolean;
    offset?: number; // Scroll margin top
}

export function useAutoScroll<T extends HTMLElement>({ isExpanded, ref, parentRef, enabled = true, offset = 0 }: UseAutoScrollProps<T>) {
    const isFirstRun = useRef(true);

    useEffect(() => {
        if (!enabled) return;

        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }

        if (isExpanded) {
            // Expand: Scroll to element
            setTimeout(() => {
                const element = ref.current;
                if (!element) return;

                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300); // Wait for expansion animation
        } else {
            // Collapse: Scroll to parent OR Top
            setTimeout(() => {
                if (parentRef && parentRef.current) {
                    parentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    // Default to top of window
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
                    document.body.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }, 100); // Wait for collapse animation start
        }
    }, [isExpanded, enabled, ref, parentRef, offset]);
}
