import * as Yup from 'yup';

export interface SignupFormValues {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

export const signupValidationSchema = Yup.object().shape({
  first_name: Yup.string()
    .min(2, 'Ad en az 3 karakter olmalı')
    .max(50, 'Ad en fazla 50 karakter olabilir')
    .required('Ad zorunlu'),
  last_name: Yup.string()
    .min(2, 'Soyad en az 3 karakter olmalı')
    .max(50, 'Soyad en fazla 50 karakter olabilir')
    .required('Soyad zorunlu'),
  username: Yup.string()
    .min(3, 'Kullanıcı adı en az 3 karakter olmalı')
    .max(30, 'Kullanıcı adı en fazla 30 karakter olabilir')
    .matches(/^[a-zA-Z0-9_]+$/, 'Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir')
    .required('Kullanıcı adı zorunlu'),
  email: Yup.string()
    .email('Geçerli bir email adresi girin')
    .required('Email zorunlu'),
  password: Yup.string()
    .min(8, 'Şifre en az 8 karakter olmalı')
    .matches(/(?=.*[a-z])/, 'Şifre en az bir küçük harf içermeli')
    .matches(/(?=.*[A-Z])/, 'Şifre en az bir büyük harf içermeli')
    .matches(/(?=.*\d)/, 'Şifre en az bir rakam içermeli')
    .matches(/(?=.*[@$!%*?&.,])/, 'Şifre en az bir özel karakter içermeli')
    .required('Şifre zorunlu'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Şifreler eşleşmiyor')
    .required('Şifre tekrarı zorunlu'),
  terms: Yup.boolean()
    .oneOf([true], 'Kullanım şartlarını kabul etmelisiniz')
    .required('Kullanım şartlarını kabul etmelisiniz')
});

export const signupInitialValues: SignupFormValues = {
  first_name: '',
  last_name: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: false
};
