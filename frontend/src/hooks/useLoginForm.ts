import * as Yup from 'yup';

export interface LoginFormValues {
  email_or_username: string;
  password: string;
  remember_me: boolean;
}

export const loginValidationSchema = Yup.object().shape({
  email_or_username: Yup.string()
    .min(3, 'Email veya kullanıcı adı en az 3 karakter olmalı')
    .required('Email veya kullanıcı adı zorunlu'),
  password: Yup.string()
    .min(8, 'Şifre en az 8 karakter olmalı')
    .required('Şifre zorunlu'),
  remember_me: Yup.boolean()
});

export const loginInitialValues: LoginFormValues = {
  email_or_username: '',
  password: '',
  remember_me: false
};
