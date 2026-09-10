import { useState, useMemo } from 'react';

export function usePagination<T>(data: T[], itemsPerPage: number) {
    const [currentPage, setCurrentPage] = useState(1);

    // Tính tổng số trang (ít nhất là 1 trang)
    const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));

    // Cắt mảng dữ liệu gốc để lấy dữ liệu cho trang hiện tại
    const currentData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return data.slice(startIndex, endIndex);
    }, [data, currentPage, itemsPerPage]);

    // Hàm chuyển sang trang tiếp theo
    const next = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    // Hàm quay lại trang trước
    const prev = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    // Hàm nhảy đến một trang cụ thể
    const goToPage = (page: number) => {
        const validPage = Math.max(1, Math.min(page, totalPages));
        setCurrentPage(validPage);
    };

    return {
        currentPage,
        totalPages,
        currentData,
        next,
        prev,
        goToPage,
    };
}