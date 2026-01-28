import toast from 'react-hot-toast';

/**
 * Toast bildirimleri için yardımcı fonksiyonlar
 */

export const showToast = {
  /**
   * Başarılı işlem bildirimi
   */
  success: (message: string) => {
    toast.success(message, {
      duration: 3000,
    });
  },

  /**
   * Hata bildirimi
   */
  error: (message: string) => {
    toast.error(message, {
      duration: 4000,
    });
  },

  /**
   * Bilgilendirme bildirimi
   */
  info: (message: string) => {
    toast(message, {
      duration: 3500,
      icon: 'ℹ️',
    });
  },

  /**
   * Uyarı bildirimi
   */
  warning: (message: string) => {
    toast(message, {
      duration: 4000,
      icon: '⚠️',
      style: {
        background: '#1f2937',
        border: '1px solid rgba(251, 191, 36, 0.5)',
      },
    });
  },

  /**
   * Yükleme bildirimi (promise ile kullanılır)
   */
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    });
  },

  /**
   * Özel toast (promise için)
   */
  loading: (message: string) => {
    return toast.loading(message);
  },

  /**
   * Toast'ı kapat
   */
  dismiss: (toastId?: string) => {
    toast.dismiss(toastId);
  },
};

// Genel kullanım için export
export { toast };
