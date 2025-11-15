// useCustomHooks.test.js - Unit tests for custom hooks
import { renderHook, act, waitFor } from '@testing-library/react';
import { useForm, useAsync, useDebounce, useLocalStorage } from '../../hooks/useCustomHooks';

describe('Custom Hooks', () => {
  describe('useForm', () => {
    it('should initialize with default values', () => {
      const initialValues = { name: '', email: '' };
      const { result } = renderHook(() => useForm(initialValues, jest.fn()));

      expect(result.current.values).toEqual(initialValues);
      expect(result.current.errors).toEqual({});
      expect(result.current.touched).toEqual({});
    });

    it('should update values on input change', () => {
      const initialValues = { name: '' };
      const { result } = renderHook(() => useForm(initialValues, jest.fn()));

      act(() => {
        result.current.handleChange({
          target: { name: 'name', value: 'John' },
        });
      });

      expect(result.current.values.name).toBe('John');
    });

    it('should mark field as touched on blur', () => {
      const initialValues = { email: '' };
      const { result } = renderHook(() => useForm(initialValues, jest.fn()));

      act(() => {
        result.current.handleBlur({ target: { name: 'email' } });
      });

      expect(result.current.touched.email).toBe(true);
    });

    it('should reset form to initial values', () => {
      const initialValues = { name: '', email: '' };
      const { result } = renderHook(() => useForm(initialValues, jest.fn()));

      act(() => {
        result.current.setFieldValue('name', 'John');
      });

      expect(result.current.values.name).toBe('John');

      act(() => {
        result.current.resetForm();
      });

      expect(result.current.values).toEqual(initialValues);
    });

    it('should call onSubmit with form values', async () => {
      const initialValues = { name: 'John', email: 'john@example.com' };
      const onSubmit = jest.fn().mockResolvedValue(undefined);
      const { result } = renderHook(() => useForm(initialValues, onSubmit));

      act(() => {
        result.current.handleSubmit({ preventDefault: jest.fn() });
      });

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(initialValues);
      });
    });

    it('should set field errors', () => {
      const initialValues = { name: '' };
      const { result } = renderHook(() => useForm(initialValues, jest.fn()));

      act(() => {
        result.current.setFieldError('name', 'Name is required');
      });

      expect(result.current.errors.name).toBe('Name is required');
    });
  });

  describe('useAsync', () => {
    it('should start with idle status', () => {
      const asyncFunction = jest.fn();
      const { result } = renderHook(() => useAsync(asyncFunction));

      expect(result.current.status).toBe('idle');
      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();
    });

    it('should handle successful async operation', async () => {
      const mockData = { id: 1, name: 'Test' };
      const asyncFunction = jest.fn().mockResolvedValue(mockData);
      const { result } = renderHook(() => useAsync(asyncFunction));

      act(() => {
        result.current.execute();
      });

      await waitFor(() => {
        expect(result.current.status).toBe('success');
      });

      expect(result.current.data).toEqual(mockData);
    });

    it('should handle async operation errors', async () => {
      const error = new Error('Async error');
      const asyncFunction = jest.fn().mockRejectedValue(error);
      const { result } = renderHook(() => useAsync(asyncFunction));

      act(() => {
        result.current.execute();
      });

      await waitFor(() => {
        expect(result.current.status).toBe('error');
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useDebounce', () => {
    jest.useFakeTimers();

    it('should debounce value updates', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 500 } }
      );

      expect(result.current).toBe('initial');

      rerender({ value: 'updated', delay: 500 });
      expect(result.current).toBe('initial');

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result.current).toBe('updated');
    });

    it('should cancel previous debounce on new value', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'first', delay: 500 } }
      );

      rerender({ value: 'second', delay: 500 });
      act(() => {
        jest.advanceTimersByTime(100);
      });

      rerender({ value: 'third', delay: 500 });
      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result.current).toBe('third');
    });

    jest.useRealTimers();
  });

  describe('useLocalStorage', () => {
    beforeEach(() => {
      localStorage.clear();
      jest.clearAllMocks();
    });

    it('should initialize with initial value', () => {
      const { result } = renderHook(() => useLocalStorage('testKey', 'initial'));

      expect(result.current[0]).toBe('initial');
    });

    it('should store value in localStorage', () => {
      const { result } = renderHook(() => useLocalStorage('testKey', ''));

      act(() => {
        result.current[1]('newValue');
      });

      expect(result.current[0]).toBe('newValue');
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'testKey',
        JSON.stringify('newValue')
      );
    });

    it('should retrieve stored value on initialization', () => {
      localStorage.getItem.mockReturnValue(JSON.stringify('storedValue'));

      const { result } = renderHook(() => useLocalStorage('testKey', 'initial'));

      expect(result.current[0]).toBe('storedValue');
    });

    it('should handle objects', () => {
      const { result } = renderHook(() => useLocalStorage('testKey', {}));

      const testObject = { name: 'test', value: 123 };

      act(() => {
        result.current[1](testObject);
      });

      expect(result.current[0]).toEqual(testObject);
    });
  });
});
