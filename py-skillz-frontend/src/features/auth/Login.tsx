import React, { useState } from "react";
import { BackButton } from "../../components/shared/BackButton";
import { ILogin } from "../../types";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../hooks/useAuth"; 
import { useNavigate } from "react-router-dom"; 

export const Login = () => {
  const [data, setData] = useState<ILogin>({ email: "", password: "" });
  const [errors, setErrors] = useState<string[]>([]);
  const { login } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const loginErrors = await login(data);
    if (loginErrors) {
      setErrors(loginErrors);
    } else {
      navigate("/dashboard"); // Redirige al dashboard u otra ruta
    }
  };

  return (
    <div>
      <BackButton />
      <div className="w-full h-auto">
        <form onSubmit={onSubmitForm}>
          <div className="flex flex-col items-center justify-center gap-3">
            <h1 className="text-3xl font-bold">{t("auth.login")}</h1>
            <div className="flex flex-col items-center justify-center gap-3">
              <input
                type="email"
                placeholder={t("auth.email")}
                className="w-full p-2 border-2 border-gray-400 rounded-md"
                name="email"
                value={data.email}
                onChange={onDataChange}
              />
              <input
                type="password"
                placeholder={t("auth.password")}
                className="w-full p-2 border-2 border-gray-400 rounded-md"
                name="password"
                value={data.password}
                onChange={onDataChange}
              />
            </div>
            <button
              type="submit"
              className="p-2 border-2 border-gray-400 rounded-md bg-primary text-white"
            >
              {t("auth.login")}
            </button>
          </div>
          {errors.length > 0 && (
            <ul className="text-red-500 list-disc pl-5 mt-2">
              {errors.map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
          )}
        </form>
      </div>
    </div>
  );
};
