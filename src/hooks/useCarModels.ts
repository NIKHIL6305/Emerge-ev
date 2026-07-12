import { useState, useEffect } from 'react';
import { CAR_MODELS } from '../data/cars';

export function useCarModels() {
  const [carModels, setCarModels] = useState(CAR_MODELS);

  useEffect(() => {
    const loadCustomImages = () => {
      const customImagesStr = localStorage.getItem('custom_car_images');
      if (customImagesStr) {
        try {
          const customImages = JSON.parse(customImagesStr);
          setCarModels(CAR_MODELS.map(car => ({
            ...car,
            image: customImages[car.id] || car.image
          })));
        } catch (e) {
          console.error('Failed to parse custom images', e);
        }
      }
    };

    loadCustomImages();
    window.addEventListener('storage', loadCustomImages);
    window.addEventListener('custom_images_updated', loadCustomImages);

    return () => {
      window.removeEventListener('storage', loadCustomImages);
      window.removeEventListener('custom_images_updated', loadCustomImages);
    };
  }, []);

  return carModels;
}

export function updateCustomCarImage(carId: string, imageUrl: string) {
  const customImagesStr = localStorage.getItem('custom_car_images');
  let customImages: Record<string, string> = {};
  if (customImagesStr) {
    try {
      customImages = JSON.parse(customImagesStr);
    } catch (e) {}
  }
  customImages[carId] = imageUrl;
  localStorage.setItem('custom_car_images', JSON.stringify(customImages));
  window.dispatchEvent(new Event('custom_images_updated'));
}
