import { CreateProductData } from '../../types';

export const makeFormData = (data: CreateProductData) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (key === 'image') {
      // If value is a File object, append it directly
      if (value instanceof File) {
        formData.append(key, value);
      }
      // If it's an object with file property, append the file
      else if (
        typeof value === 'object' &&
        value !== null &&
        'file' in value &&
        value.file instanceof File
      ) {
        formData.append(key, value.file);
      }
    } else if (key === 'priceConfiguration' || key === 'attributes') {
      formData.append(key, JSON.stringify(value));
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });
  
  return formData;
};

export const capitalizeFirst = (str: string) => {
  return str[0].toUpperCase() + str.slice(1);
};