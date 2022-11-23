export interface IMailPayload {
  template: keyof typeof EmailTemplates;
  payload: PaylaodType;
}

enum EmailTemplates {
  SIGNUP = 'signup',
}

interface PaylaodType {
  email: string;
  subject: string;
  data: any;
}
