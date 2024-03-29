export type Promotion = {
	id: number;
	title: string;
	description: string;
	image: string;
	background_color: string;
	color: string;
	expired_at: string;
	created_at: string;
	updated_at: string;
	promotion_item?: any[] | null;
	store_id: number;
	start_at: string;
};

export type PromotionWithStoreName = {
	id: number;
	title: string;
	description: string;
	image: string;
	background_color: string;
	color: string;
	expired_at: string;
	created_at: string;
	updated_at: string;
	promotion_items?: any[] | null;
	store_id: number;
	store_name: string;
	start_at: string;
};