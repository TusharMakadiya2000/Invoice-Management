export interface UserCardType {
  name: string;
  position: string;
  role: string;
  image: string;
}
export interface servicesListType {
  title: string;
  description: string;
  image: string;
}

export interface blogListType {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  status: string;
  name: string;
}
export interface PopularBlogCardType {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  status: string;
  name: string;
}
export interface overviewCardType {
  title: string;
  number: string;
  icon: string;
}
export interface MessageCardType {
  name: string;
  image: string;
  title: string;
  time: string;
  messages: string;
}
