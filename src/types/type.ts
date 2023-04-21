export type Users = {
  id: Number | null;
  firstName: String;
  lastName: String;
  email: String;
  password: String;
  isAdmin: Boolean | null;
  authId: String;
  polledPopular: Boolean | null;
  polledOther: Boolean | null;
};

export type Items = {
  id: Number;
  name: String;
  description: String;
  image: string;
  itemCategory: Number;
  createdAt: Date;
  intheOffice: Boolean;
  author: String;
};

export type Polls = {
  id: Number;
  name: String;
  polledItems: [
    { id: Number; itemId: Number; name: String; detail: String; result: Number }
  ];
  createdAt: Date;
  category: Number;
  startDate: Date;
  endDate: Date;
  author: Number;
};
