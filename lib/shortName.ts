
// Utility function with static typing
export const shortName = (name: string, limit: number = 5): string => {
    // Static type checking - ensure parameters are correct types
    if (typeof name !== 'string') {
        throw new Error('Name must be a string');
    }
    
    if (typeof limit !== 'number' || limit < 0) {
        throw new Error('Limit must be a positive number');
    }
    
    // Trim and handle empty/invalid input
    const trimmedName: string = name.trim();
    
    if (!trimmedName) {
        return '';
    }
    
    // Get first 'limit' characters with static typing
    const result: string = trimmedName.slice(0, limit);
    return result;
};