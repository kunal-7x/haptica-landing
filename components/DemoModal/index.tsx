"use client";

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";
import DemoModalUI from "./DemoModalUI";

type Ctx = { open: () => void; close: () => void; isOpen: boolean };

const DemoContext = createContext<Ctx | null>(null);

/** Open/close the global Book-a-demo modal from any CTA. No-op if outside provider. */
export function useDemo(): Ctx {
    return (
        useContext(DemoContext) ?? {
            open: () => {},
            close: () => {},
            isOpen: false,
        }
    );
}

export function DemoProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setOpen] = useState(false);
    const open = useCallback(() => setOpen(true), []);
    const close = useCallback(() => setOpen(false), []);
    const value = useMemo(() => ({ open, close, isOpen }), [open, close, isOpen]);
    return (
        <DemoContext.Provider value={value}>
            {children}
            <DemoModalUI isOpen={isOpen} onClose={close} />
        </DemoContext.Provider>
    );
}
