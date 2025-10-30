
import { useState, useCallback } from 'react';
import { UserCredits } from '../types';
import useLocalStorage from './useLocalStorage';
import { ALL_FIELDS } from '../constants';

const initialCredits: UserCredits = {
    balance: 10000,
    used_today: 150,
    used_this_month: 1200,
    plan_limit: 50000,
    renewal_date: '2025-11-01',
};

const useCreditSystem = () => {
    const [credits, setCredits] = useLocalStorage<UserCredits>('userCredits', initialCredits);
    const [isAdminMode, setIsAdminMode] = useLocalStorage<boolean>('adminMode', true);

    const estimateCredits = useCallback((emailCount: number, selectedFieldIds: string[]) => {
        let creditsPerContact = 0;
        const fieldBreakdown: Record<string, number> = {};

        selectedFieldIds.forEach(fieldId => {
            const field = ALL_FIELDS.find(f => f.id === fieldId);
            if (field) {
                creditsPerContact += field.cost;
                fieldBreakdown[field.name] = field.cost;
            }
        });
        
        const totalCredits = emailCount * creditsPerContact;

        return {
            emails: emailCount,
            credits_per_contact: creditsPerContact,
            total_credits: totalCredits,
            field_breakdown: fieldBreakdown,
            can_afford: isAdminMode ? true : totalCredits <= credits.balance,
            shortfall: isAdminMode ? 0 : Math.max(0, totalCredits - credits.balance),
            current_balance: credits.balance,
            remaining_after: isAdminMode ? credits.balance : credits.balance - totalCredits,
        };
    }, [credits.balance, isAdminMode]);

    const consumeCredits = useCallback((amount: number) => {
        if (isAdminMode) return; // Skip credit consumption in admin mode
        setCredits(prev => ({
            ...prev,
            balance: prev.balance - amount,
            used_today: prev.used_today + amount,
            used_this_month: prev.used_this_month + amount,
        }));
    }, [setCredits, isAdminMode]);
    
    const getWarning = useCallback(() => {
        if (isAdminMode) return null; // No warnings in admin mode
        const percentage = (credits.balance / credits.plan_limit) * 100;
        if (percentage <= 5) return { level: 'critical', message: 'Critical: Only 5% credits remaining!' };
        if (percentage <= 10) return { level: 'warning', message: 'Warning: Only 10% credits remaining.' };
        if (percentage <= 20) return { level: 'info', message: 'Info: 20% credits remaining.' };
        return null;
    }, [credits.balance, credits.plan_limit, isAdminMode]);

    const toggleAdminMode = useCallback(() => {
        setIsAdminMode(prev => !prev);
    }, [setIsAdminMode]);

    return {
        credits,
        estimateCredits,
        consumeCredits,
        getWarning,
        setCredits, // For mock updates
        isAdminMode,
        toggleAdminMode,
    };
};

export default useCreditSystem;
