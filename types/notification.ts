export type Notification = {
  notification_id: number;
  title: string;
  message: string;
  type: NotificationType;
  created_at: string;
  updated_at: string;
}

export type InputCreateNotification = {
  message: string;
  title: string;
  type: NotificationType;
  sender_type: NotificationSenderType;
  store_ids?: number[];
  member_ids?: number[]; 
}

export enum NotificationType {
  INFO = 'INFO',
  PROMO = 'PROMO',
  VOUCHER = 'VOUCHER',
  TRANSACTION = 'TRANSACTION'
}

export enum NotificationSenderType {
  ALL = 'ALL',
  MEMBER = 'MEMBER',
  STORE = 'STORE'
}