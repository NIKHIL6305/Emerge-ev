export const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'success' | 'error' = 'light') => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      switch (type) {
        case 'light':
          navigator.vibrate(10);
          break;
        case 'medium':
          navigator.vibrate(20);
          break;
        case 'heavy':
          navigator.vibrate(40);
          break;
        case 'success':
          navigator.vibrate([10, 50, 20]);
          break;
        case 'error':
          navigator.vibrate([20, 50, 20, 50, 40]);
          break;
      }
    } catch (e) {
      // Ignore errors if haptics fail
    }
  }
};
