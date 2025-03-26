// 工具函数
export const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
};

export const formatDate = (dateString, timeString) => {
    // If date is invalid, return the original string
    if (!dateString) return '';
    
    try {
        const [year, month, day] = dateString.split('-');
        const formattedDate = `${year}/${month}/${day}`;
        return timeString ? `${formattedDate} ${timeString}` : formattedDate;
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
};

// 数据存储相关函数
export const getAppointments = () => {
    return JSON.parse(localStorage.getItem('appointments') || '[]');
};

export const saveAppointments = (appointments) => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
};

// 表单验证函数
export const validatePhone = (phone) => {
    // This regex supports various international phone formats
    return /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(phone.trim());
};

export const validateRequired = (value) => {
    return value && value.trim().length > 0;
};
