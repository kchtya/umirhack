import bcrypt from 'bcryptjs';

// Generate random string for various purposes (генерация случайной строки для разных задач (коды подтверждения))
export const generateRandomString = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Generate secure random token
export const generateSecureToken = (length = 32) => {
  const crypto = require('crypto');
  return crypto.randomBytes(length).toString('hex');
};

// Format date to readable string (преобразовать дату в удобочитаемый формат)
export const formatDate = (date, includeTime = false) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }

  return new Date(date).toLocaleDateString('ru-RU', options);
};

// Calculate reading time for content (определить приблизительное время чтения)
export const calculateReadingTime = (text) => {
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return readingTime;
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate URL format
export const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

// Sanitize HTML to prevent XSS (обезопасить HTML от XSS-атак)
export const sanitizeHtml = (html) => {
  if (!html) return '';
  
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Truncate text with ellipsis (сократить текст с добавлением троеточия)
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// Generate slug from text (создать читаемый URL из текста)
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\u0400-\u04FF]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/--+/g, '-');
};

// Format file size to human readable format (преобразовать размер файла в удобочитаемый формат)
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Debounce function for search inputs
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Deep clone object (полное копирование объекта)
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (obj instanceof Object) {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

// Check if object is empty
export const isEmpty = (obj) => {
  if (!obj) return true;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return !obj;
};

// Generate password hash
export const generatePasswordHash = async (password) => {
  return await bcrypt.hash(password, 12);
};

// Compare password with hash
export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// Generate default avatar URL based on name (сгенерировать URL аватара по умолчанию на основе имени)
export const generateAvatarUrl = (name, size = 100) => {
  const initials = name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);

  const colors = [
    'FF6B6B', '4ECDC4', '45B7D1', '96CEB4', 'FFEAA7',
    'DDA0DD', '98D8C8', 'F7DC6F', 'BB8FCE', '85C1E9'
  ];
  
  const color = colors[initials.charCodeAt(0) % colors.length];
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${color}&color=fff&size=${size}`;
};

// Validate Russian phone number (проверить российский номер телефона)
export const isValidRussianPhone = (phone) => {
  const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Format Russian phone number
export const formatRussianPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);
  
  if (match) {
    return `+7 (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
  }
  
  return phone;
};

// Generate project name based on template
export const generateProjectName = (templateName) => {
  const timestamp = new Date().toLocaleDateString('ru-RU');
  return `${templateName} - ${timestamp}`;
};

// Calculate project complexity based on blocks
export const calculateProjectComplexity = (blocks) => {
  if (!blocks || !Array.isArray(blocks)) return 'easy';
  
  const blockCount = blocks.length;
  const hasCustomStyles = blocks.some(block => 
    block.styles && Object.keys(block.styles).length > 0
  );
  
  if (blockCount > 15 || hasCustomStyles) return 'hard';
  if (blockCount > 8) return 'medium';
  return 'easy';
};

// Export all helper functions
export default {
  generateRandomString,
  generateSecureToken,
  formatDate,
  calculateReadingTime,
  isValidEmail,
  isValidUrl,
  sanitizeHtml,
  truncateText,
  generateSlug,
  formatFileSize,
  debounce,
  deepClone,
  isEmpty,
  generatePasswordHash,
  comparePassword,
  generateAvatarUrl,
  isValidRussianPhone,
  formatRussianPhone,
  generateProjectName,
  calculateProjectComplexity
};