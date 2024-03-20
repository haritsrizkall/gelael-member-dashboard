
export type Appconf = {
  slider_interval: number;
  tiktok: string;
  instagram: string;
  contacts: {
    phones: Contact[];
    emails: Contact[];
  };
  terms_condition: string;
  privacy_policy: string;
}

export type Contact = {
  name: string;
  value: string;
}