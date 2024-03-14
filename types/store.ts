export type StoreList = {
  store_id: number;
  name: string;
}

export type Store = {
  store_id: number;
  name: string;
  address: string;
  phone_number: string;
  store_manager: string;
  store_manager_image: string;
  duty_manager_1: string;
  duty_manager_1_image: string;
  duty_manager_2: string;
  duty_manager_2_image: string;
  store_images: StoreImage[];
  smartsoft_id: string;
}

export type StoreImage = {
  store_image_id: number;
  store_id: number;
  image: string;
  created_at: string;
  updated_at: string;
}