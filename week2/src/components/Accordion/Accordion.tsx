import React, { createContext, useContext, useState, ReactNode } from 'react';

// 1. Khởi tạo Context để lưu trạng thái panel nào đang mở
interface AccordionContextType {
    activeValue: string | null;
    togglePanel: (value: string) => void;
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

// Hook dùng chung nội bộ để các component con lấy Context
const useAccordionContext = () => {
    const context = useContext(AccordionContext);
    if (!context) {
        throw new Error('Các component con của Accordion phải nằm trong <Accordion>');
    }
    return context;
};

// 2. Component Cha (Provider)
interface AccordionProps {
    children: ReactNode;
    defaultValue?: string | null;
}

export const Accordion = ({ children, defaultValue = null }: AccordionProps) => {
    const [activeValue, setActiveValue] = useState<string | null>(defaultValue);

    const togglePanel = (value: string) => {
        // Nếu bấm lại panel đang mở -> đóng nó (null). Nếu bấm panel khác -> mở panel đó
        setActiveValue((prev) => (prev === value ? null : value));
    };

    return (
        <AccordionContext.Provider value={{ activeValue, togglePanel }}>
            <div style={{ border: '1px solid #ccc', borderRadius: '4px', width: '400px' }}>
                {children}
            </div>
        </AccordionContext.Provider>
    );
};

// 3. Component Con: Lớp bọc từng mục
Accordion.Item = ({ children }: { children: ReactNode }) => {
    return <div style={{ borderBottom: '1px solid #eee' }}>{children}</div>;
};

// 4. Component Con: Phần Header (Tiêu đề để click)
Accordion.Header = ({ value, children }: { value: string; children: ReactNode }) => {
    const { activeValue, togglePanel } = useAccordionContext();
    const isOpen = activeValue === value;

    return (
        <div
            onClick={() => togglePanel(value)}
            style={{
                padding: '10px',
                backgroundColor: isOpen ? '#f0f0f0' : '#fff',
                cursor: 'pointer',
                fontWeight: isOpen ? 'bold' : 'normal',
                display: 'flex',
                justifyContent: 'space-between'
            }}
        >
            {children}
            <span>{isOpen ? '[-]' : '[+]'}</span>
        </div>
    );
};

// 5. Component Con: Phần Panel (Nội dung ẩn/hiện)
Accordion.Panel = ({ value, children }: { value: string; children: ReactNode }) => {
    const { activeValue } = useAccordionContext();
    const isOpen = activeValue === value;

    // Chỉ render nội dung nếu panel này đang được active
    if (!isOpen) return null;

    return (
        <div style={{ padding: '10px 15px', color: '#555', backgroundColor: '#fafafa' }}>
            {children}
        </div>
    );
};