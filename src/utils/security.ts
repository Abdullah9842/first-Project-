import { auth } from '../componets/firebase';

export const securityUtils = {
  // التحقق من صحة التوكن
  validateToken: async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await user.getIdToken(true);
        return true;
      } catch (error) {
        console.error('Token validation failed:', error);
        return false;
      }
    }
    return false;
  },

  // تنظيف البيانات المدخلة
  sanitizeInput: (input: string): string => {
    return input.replace(/<[^>]*>?/gm, '');
  },

  // التحقق من صحة المستخدم
  validateUser: (userId: string): boolean => {
    return auth.currentUser?.uid === userId;
  }
}; 