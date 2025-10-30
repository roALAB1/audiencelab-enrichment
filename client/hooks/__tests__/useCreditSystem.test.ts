import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useCreditSystem from '../useCreditSystem';

describe('useCreditSystem', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with default credits', () => {
    const { result } = renderHook(() => useCreditSystem());
    
    expect(result.current.credits).toBe(10000);
    expect(result.current.maxCredits).toBe(50000);
  });

  it('should estimate credits correctly', () => {
    const { result } = renderHook(() => useCreditSystem());
    
    const estimate = result.current.estimateCredits(100, ['email', 'first_name', 'last_name']);
    
    expect(estimate.emails).toBe(100);
    expect(estimate.credits_per_contact).toBe(3); // 3 fields
    expect(estimate.total_credits).toBe(300); // 100 * 3
    expect(estimate.can_afford).toBe(true);
  });

  it('should consume credits', () => {
    const { result } = renderHook(() => useCreditSystem());
    
    act(() => {
      result.current.consumeCredits(500);
    });
    
    expect(result.current.credits).toBe(9500);
  });

  it('should not allow negative credits', () => {
    const { result } = renderHook(() => useCreditSystem());
    
    act(() => {
      result.current.consumeCredits(15000); // More than available
    });
    
    expect(result.current.credits).toBe(0);
  });

  it('should detect insufficient credits', () => {
    const { result } = renderHook(() => useCreditSystem());
    
    const estimate = result.current.estimateCredits(1000, ['email', 'first_name', 'last_name', 'job_title', 'company']);
    
    expect(estimate.total_credits).toBe(5000); // 1000 * 5
    expect(estimate.can_afford).toBe(true);
    
    const largeEstimate = result.current.estimateCredits(10000, ['email', 'first_name', 'last_name', 'job_title', 'company']);
    
    expect(largeEstimate.total_credits).toBe(50000);
    expect(largeEstimate.can_afford).toBe(false);
    expect(largeEstimate.shortfall).toBe(40000);
  });

  it('should calculate warnings correctly', () => {
    const { result } = renderHook(() => useCreditSystem());
    
    act(() => {
      result.current.consumeCredits(9000); // Leave 1000 credits
    });
    
    const warnings = result.current.getWarnings();
    
    expect(warnings.length).toBeGreaterThan(0);
    expect(warnings[0].level).toBe('critical');
  });
});

