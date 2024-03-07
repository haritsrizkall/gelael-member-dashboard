export type Promotion = {
	id: number;
	title: string;
	description: string;
	image: string;
	color: string;
	expired_at: string;
	created_at: string;
	updated_at: string;
	promotion_items?: any[] | null;
	store_id: number;
};