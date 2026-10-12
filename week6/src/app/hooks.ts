import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/**
 * Typed version của useDispatch — luôn dùng hook này thay vì useDispatch thường
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

/**
 * Typed version của useSelector — luôn dùng hook này thay vì useSelector thường
 */
export const useAppSelector = useSelector.withTypes<RootState>();
