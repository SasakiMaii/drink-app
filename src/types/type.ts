export type Users = {
  id: number | null;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAdmin: Boolean | null;
  authId: string;
  polledPopular: Boolean | null;
  polledOther: Boolean | null;
};

export type Items = {
  id: number;
  name: string;
  description: string;
  image: string[];
  itemCategory: number;
  createdAt: Date;
  intheOffice: boolean;
  author: string;
};

export type Questionnaire = {
  id: number;
  name: string;
  polledItems: [
    {
      id: number;
      itemId?: number;
      result?: number;
    }
  ];
  createdAt: Date;
  category: number;
  startDate: Date;
  endDate: Date;
  author?: number;
};

export type Polls = {
  id: number;
  questionnaireId: number;
  userId: number;
  result: number;
  createdAt: Date;
};

export type Posts = {
  id: number;
  userId: number;
  content: string;
  itemId: number;
  postImage: string[];
  createdAt: Date;
  updatedAt: Date;
};
