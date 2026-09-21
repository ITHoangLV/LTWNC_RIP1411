import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/**
 * Typed version của useDispatch — luôn dùng hook này thay vì useDispatch thường
 * để TypeScript biết được kiểu của các async thunk actions
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

/**
 * Typed version của useSelector — luôn dùng hook này thay vì useSelector thường
 * để có autocomplete đầy đủ khi truy cập state
 */
export const useAppSelector = useSelector.withTypes<RootState>();
