import { renderHook, act } from '@testing-library/react';
import { useRegistration } from './useRegistration';

describe('useRegistration hook', () => {

  // INITIAL STATE

  test('initial state is correct', () => {
    const { result } = renderHook(() => useRegistration());

    expect(result.current.currentStep).toBe(1);
    expect(result.current.data.email).toBe('');
    expect(result.current.data.password).toBe('');
    expect(result.current.data.selectedCategories).toEqual([]);
    expect(result.current.data.selectedSubcategories).toEqual([]);
    expect(result.current.data.teachSkill).toEqual({
      name: '',
      categoryId: 0,
      subcategoryId: 0,
      description: '',
      images: [],
    });
  });

  // STEP NAVIGATION

  test('nextStep increments step up to 3', () => {
    const { result } = renderHook(() => useRegistration());

    act(() => result.current.nextStep());
    expect(result.current.currentStep).toBe(2);

    act(() => result.current.nextStep());
    expect(result.current.currentStep).toBe(3);

    act(() => result.current.nextStep());
    expect(result.current.currentStep).toBe(3);
  });

  test('prevStep decrements step but not below 1', () => {
    const { result } = renderHook(() => useRegistration());

    act(() => {
      result.current.nextStep();
      result.current.nextStep();
    });
    expect(result.current.currentStep).toBe(3);

    act(() => result.current.prevStep());
    expect(result.current.currentStep).toBe(2);

    act(() => result.current.prevStep());
    expect(result.current.currentStep).toBe(1);

    act(() => result.current.prevStep());
    expect(result.current.currentStep).toBe(1);
  });

  test('goToStep clamps step into 1–3', () => {
    const { result } = renderHook(() => useRegistration());

    act(() => result.current.goToStep(2));
    expect(result.current.currentStep).toBe(2);

    act(() => result.current.goToStep(10));
    expect(result.current.currentStep).toBe(3);

    act(() => result.current.goToStep(0));
    expect(result.current.currentStep).toBe(1);
  });

  // DATA UPDATES

  test('updateData merges new data', () => {
    const { result } = renderHook(() => useRegistration());

    act(() => result.current.updateData({ email: 'test@mail.com' }));
    expect(result.current.data.email).toBe('test@mail.com');

    act(() => result.current.updateData({ selectedCategories: [1, 2] }));
    expect(result.current.data.selectedCategories).toEqual([1, 2]);
  });

  test('updateData merges teachSkill using full object', () => {
    const { result } = renderHook(() => useRegistration());

    // обновляем частично, но передаём полный teachSkill
    act(() =>
      result.current.updateData({
        teachSkill: {
          ...result.current.data.teachSkill,
          name: 'Skill A',
        },
      })
    );

    expect(result.current.data.teachSkill.name).toBe('Skill A');

    act(() =>
      result.current.updateData({
        teachSkill: {
          ...result.current.data.teachSkill,
          categoryId: 5,
        },
      })
    );

    expect(result.current.data.teachSkill).toEqual({
      name: 'Skill A',
      categoryId: 5,
      subcategoryId: 0,
      description: '',
      images: [],
    });
  });

  test('resetData resets all fields and step', () => {
    const { result } = renderHook(() => useRegistration());

    act(() => {
      result.current.updateData({ email: 'x@mail.com' });
      result.current.nextStep();
      result.current.resetData();
    });

    expect(result.current.currentStep).toBe(1);
    expect(result.current.data.email).toBe('');
  });

  // STEP VALIDATION

  test('step 1 validation', () => {
    const { result } = renderHook(() => useRegistration());

    expect(result.current.isStepValid()).toBe(false);

    act(() => result.current.updateData({ email: 'test@mail.com' }));
    expect(result.current.isStepValid()).toBe(false);

    act(() => result.current.updateData({ password: '1234567' }));
    expect(result.current.isStepValid()).toBe(false);

    act(() => result.current.updateData({ password: '12345678' }));
    expect(result.current.isStepValid()).toBe(true);
  });

  test('step 2 validation', () => {
    const { result } = renderHook(() => useRegistration());

    act(() => {
      result.current.goToStep(2);
      result.current.updateData({ name: '', selectedCategories: [] });
    });

    expect(result.current.isStepValid()).toBe(false);

    act(() => result.current.updateData({ name: 'Alex' }));
    expect(result.current.isStepValid()).toBe(false);

    act(() => result.current.updateData({ selectedCategories: [1] }));
    expect(result.current.isStepValid()).toBe(true);
  });

  test('step 3 validation', () => {
    const { result } = renderHook(() => useRegistration());

    act(() => result.current.goToStep(3));

    act(() =>
      result.current.updateData({
        teachSkill: {
          ...result.current.data.teachSkill,
          name: '',
          categoryId: 0,
          subcategoryId: 0,
        },
      })
    );
    expect(result.current.isStepValid()).toBe(false);

    act(() =>
      result.current.updateData({
        teachSkill: {
          ...result.current.data.teachSkill,
          name: 'Skill A',
          categoryId: 1,
          subcategoryId: 0,
        },
      })
    );
    expect(result.current.isStepValid()).toBe(false);

    act(() =>
      result.current.updateData({
        teachSkill: {
          ...result.current.data.teachSkill,
          name: 'Skill A',
          categoryId: 1,
          subcategoryId: 2,
        },
      })
    );
    expect(result.current.isStepValid()).toBe(true);
  });
});
