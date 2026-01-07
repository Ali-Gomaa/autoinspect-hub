import React, { useState } from 'react';
import { CarRecord, User } from '../types';
import { CAR_BRANDS, CAR_COLORS } from '../constants';

interface CarFormProps {
  onSubmit: (data: Omit<CarRecord, 'id' | 'inspectionDate' | 'inspectorId' | 'inspectorName' | 'status'>) => void;
  currentUser: User;
  initialData?: CarRecord;
  isEdit?: boolean;
}

const CarForm: React.FC<CarFormProps> = ({ onSubmit, initialData, isEdit }) => {
  const [formData, setFormData] = useState({
    brand: initialData?.brand || '',
    type: initialData?.type || '',
    model: initialData?.model || '',
    color: initialData?.color || '',
    chassisNumber: initialData?.chassisNumber || '',
    mileage: initialData?.mileage || 0,
    notes: initialData?.notes || '',
    images: initialData?.images || [] as string[]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const currentImagesCount = formData.images.length;
    const remainingSlots = 10 - currentImagesCount;
    // Fix: Explicitly cast the Array.from result to File[] to resolve 'unknown' property errors (size, name) and ensure compatibility with FileReader.
    const filesToProcess = Array.from(files).slice(0, remainingSlots) as File[];

    if (files.length > remainingSlots) {
      alert("يمكنك رفع 10 صور كحد أقصى للسيارة الواحدة.");
    }

    const newImages: string[] = [];
    let processedCount = 0;

    filesToProcess.forEach(file => {
      // Fix: Now correctly typed as File, so 'size' and 'name' properties are available.
      if (file.size > 1024 * 1024) {
        alert(`الصورة ${file.name} تتعدى مساحة 1 ميجا ولن يتم رفعها.`);
        processedCount++;
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result as string);
        processedCount++;
        if (processedCount === filesToProcess.length) {
          setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
        }
      };
      // Fix: Successfully passing typed File object to readAsDataURL.
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.brand) newErrors.brand = 'يرجى اختيار ماركة السيارة';
    if (!formData.type) newErrors.type = 'يرجى إدخال فئة السيارة';
    if (!formData.model) newErrors.model = 'يرجى إدخال سنة الموديل';
    if (!formData.color) newErrors.color = 'يرجى اختيار اللون';
    if (!formData.chassisNumber) newErrors.chassisNumber = 'يرجى إدخال رقم الشاسيه';
    if (formData.mileage < 0) newErrors.mileage = 'المسافة المقطوعة لا يمكن أن تكون بالسالب';
    if (!formData.notes) newErrors.notes = 'يرجى كتابة ملاحظات الفحص';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
      if (!isEdit) {
        setFormData({ brand: '', type: '', model: '', color: '', chassisNumber: '', mileage: 0, notes: '', images: [] });
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <i className="fas fa-clipboard-list text-indigo-600"></i>
        {isEdit ? 'طلب تعديل فحص' : 'تسجيل فحص جديد'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الماركة</label>
            <select
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white ${errors.brand ? 'border-red-500' : ''}`}
            >
              <option value="">اختر الماركة</option>
              {CAR_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">النوع (الفئة)</label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 ${errors.type ? 'border-red-500' : ''}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الموديل (السنة)</label>
            <input
              type="number"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 text-left`}
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">اللون</label>
            <select
              name="color"
              value={formData.color}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white`}
            >
              <option value="">اختر اللون</option>
              {CAR_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">رقم الشاسيه</label>
            <input
              type="text"
              name="chassisNumber"
              value={formData.chassisNumber}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 uppercase`}
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">المسافة المقطوعة (كم)</label>
            <input
              type="number"
              name="mileage"
              value={formData.mileage}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 text-left`}
              dir="ltr"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">صور السيارة (حتى 10 صور - بحد أقصى 1 ميجا لكل صورة)</label>
          <div className="flex flex-wrap gap-3 mb-3">
            {formData.images.map((img, idx) => (
              <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border">
                <img src={img} className="w-full h-full object-cover" alt="car" />
                <button 
                  type="button" 
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
            {formData.images.length < 10 && (
              <label className="w-24 h-24 border-2 border-dashed border-indigo-200 rounded-lg flex flex-col items-center justify-center text-indigo-400 cursor-pointer hover:bg-indigo-50 transition-all">
                <i className="fas fa-camera text-xl mb-1"></i>
                <span className="text-[10px] font-bold">إضافة صورة</span>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ملاحظات الفحص الفنية</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 ${errors.notes ? 'border-red-500' : ''}`}
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 transform active:scale-[0.98]"
        >
          <i className="fas fa-save"></i>
          {isEdit ? 'إرسال طلب التعديل للمشرف' : 'حفظ بيانات الفحص'}
        </button>
      </form>
    </div>
  );
};

export default CarForm;