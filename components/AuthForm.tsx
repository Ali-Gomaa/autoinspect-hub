
import React, { useState } from 'react';
import { UserRole } from '../types';

interface AuthFormProps {
  onLogin: (username: string, pass: string) => void;
  onRegister: (data: any) => boolean | void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: UserRole.USER,
    nationalId: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const englishRegex = /^[a-zA-Z0-9]*$/;

    const username = formData.username.trim();
    const password = formData.password.trim();

    if (!username) {
      newErrors.username = 'يرجى إدخال اسم المستخدم';
    } else if (!englishRegex.test(username)) {
      newErrors.username = 'يجب استخدام الأحرف الإنجليزية والأرقام فقط (بدون مسافات)';
    }

    if (!password) {
      newErrors.password = 'يرجى إدخال الرقم السري';
    } else if (!englishRegex.test(password)) {
      newErrors.password = 'يجب استخدام الأحرف الإنجليزية والأرقام فقط (بدون مسافات)';
    }

    if (!isLogin) {
      if (formData.role === UserRole.INSPECTOR) {
        if (!formData.nationalId) {
          newErrors.nationalId = 'يرجى إدخال الرقم القومي';
        } else if (!/^\d{14}$/.test(formData.nationalId)) {
          newErrors.nationalId = 'يجب أن يتكون الرقم القومي من 14 رقماً باللغة الإنجليزية';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      if (isLogin) {
        onLogin(formData.username.trim(), formData.password.trim());
      } else {
        const success = onRegister(formData);
        if (success) {
          setIsLogin(true); // Switch to login after successful register
          setFormData(prev => ({ ...prev, password: '' })); // Clear password for security
        }
      }
    }
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border">
      <div className="bg-indigo-700 p-8 text-white text-center">
        <i className="fas fa-car-side text-5xl mb-4 animate-bounce"></i>
        <h2 className="text-2xl font-bold">أوتو هب للفحص</h2>
        <p className="text-indigo-200 mt-2">نظام إدارة فحص السيارات المستعملة</p>
      </div>

      <div className="p-8">
        <div className="flex gap-4 mb-8">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setErrors({}); }}
            className={`flex-1 pb-2 border-b-2 font-bold transition-all ${isLogin ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400'}`}
          >
            دخول
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setErrors({}); }}
            className={`flex-1 pb-2 border-b-2 font-bold transition-all ${!isLogin ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400'}`}
          >
            تسجيل جديد
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">اسم المستخدم (English Only)</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-xl outline-none transition-all text-left ${errors.username ? 'border-red-500 bg-red-50' : 'focus:border-indigo-500'}`}
              dir="ltr"
              placeholder="Username"
            />
            {errors.username && <p className="text-red-500 text-xs mt-1 font-bold">{errors.username}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الرقم السري (English Only)</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-xl outline-none transition-all text-left ${errors.password ? 'border-red-500 bg-red-50' : 'focus:border-indigo-500'}`}
              dir="ltr"
              placeholder="Password"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1 font-bold">{errors.password}</p>}
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نوع الحساب</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:border-indigo-500 outline-none bg-white"
                >
                  <option value={UserRole.USER}>مستعلم (بحث فقط)</option>
                  <option value={UserRole.INSPECTOR}>فاحص (تسجيل سيارات)</option>
                </select>
              </div>

              {formData.role === UserRole.INSPECTOR && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الرقم القومي (14 رقماً)</label>
                  <input
                    type="text"
                    name="nationalId"
                    maxLength={14}
                    value={formData.nationalId}
                    onChange={handleChange}
                    placeholder="29910101234567"
                    className={`w-full px-4 py-3 border-2 rounded-xl outline-none text-left ${errors.nationalId ? 'border-red-500 bg-red-50' : 'focus:border-indigo-500'}`}
                    dir="ltr"
                  />
                  {errors.nationalId && <p className="text-red-500 text-xs mt-1 font-bold">{errors.nationalId}</p>}
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all transform active:scale-95"
          >
            {isLogin ? 'تسجيل الدخول الآن' : 'إتمام عملية التسجيل'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
