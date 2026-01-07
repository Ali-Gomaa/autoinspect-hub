
import { GoogleGenAI } from "@google/genai";
import { CarRecord } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getCarSummary = async (car: CarRecord): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `بصفتك خبير سيارات، قدم ملخصاً تقنياً مختصراً لهذه السيارة باللغة العربية:
        الماركة: ${car.brand}
        النوع: ${car.type}
        الموديل: ${car.model}
        اللون: ${car.color}
        رقم الشاسيه: ${car.chassisNumber}
        المسافة المقطوعة: ${car.mileage} كم
        ملاحظات الفحص: ${car.notes}`,
      config: {
        systemInstruction: "أنت خبير في فحص السيارات المستعملة وتقديم التقارير الفنية الموجزة.",
      }
    });
    return response.text || "لا يتوفر ملخص حالياً.";
  } catch (error) {
    console.error("AI Error:", error);
    return "حدث خطأ أثناء توليد الملخص.";
  }
};
