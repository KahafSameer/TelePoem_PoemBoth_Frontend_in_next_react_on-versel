export const required = (value: string, label: string): string | null => {
  if (!value.trim()) return `${label} is required`;
  return null;
};

export const isValidUrl = (value: string): boolean => {
  if (!value) return true;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

export const validatePoemNo = (value: number): string | null => {
  if (!Number.isInteger(value) || value <= 0) {
    return "Poem order must be a positive integer.";
  }
  return null;
};
