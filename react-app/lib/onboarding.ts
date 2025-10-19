interface OnboardingData {
  name: string;
  age: string;
}

const ONBOARDING_STORAGE_KEY = 'calmcall-onboarding';

/**
 * Get onboarding data from localStorage
 */
export function getOnboardingData(): OnboardingData | null {
  if (typeof window === 'undefined') return null;

  try {
    const data = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load onboarding data:', error);
    return null;
  }
}

/**
 * Save onboarding data to localStorage
 */
export function saveOnboardingData(data: OnboardingData): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save onboarding data:', error);
  }
}
