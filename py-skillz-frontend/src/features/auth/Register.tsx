import React, { useEffect, useState } from "react";
import { BackButton } from "../../components/shared/BackButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreateStudent } from "@/types";
import { useTranslation } from "react-i18next";
import { createStudent } from "../admin/api/api";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

const INITIAL: CreateStudent = {
  fullName: "",
  email: "",
  password: "",
};

export const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isAuthenticated = useContext(AuthContext)?.isAuthenticated;
  const [userInfo, setUserInfo] = useState<CreateStudent>(INITIAL);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string[] | undefined>(undefined);

  const onValueChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(undefined);
    try {
      const res = await createStudent(userInfo);
      if (typeof res === "string") {
        setError([res]);
      } else if ("error" in res) {
        setError(res.message);
      } else {
        alert(t("user.userCreatedSuccessfully"));
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      setError([t("errors.unknown")]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div>
      <BackButton />
      <div className="flex items-center justify-center">
        <form
          className="flex flex-col gap-4 shadow bg-background rounded items-center p-5 w-11/12 md:w-2/3 lg:w-1/2 max-h-screen overflow-y-auto border border-primary/30"
          onSubmit={onSubmit}
        >
          <p className="p-0 font-bold text-xl">{t("admin.create")}</p>
          <div className="w-full">
            <label className="font-bold" htmlFor="fullName">
              {t("admin.fullName")} <span className="text-red-500">*</span>
            </label>

            <Input
              id="fullName"
              name="fullName"
              placeholder={t("admin.fullName") || "Nombre completo"}
              value={userInfo.fullName}
              onChange={onValueChange}
              required
            />
          </div>
          <div className="w-full">
            <label className="font-bold" htmlFor="email">
              {t("admin.email")} <span className="text-red-500">*</span>
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={t("admin.email") || "Correo electrónico"}
              value={userInfo.email}
              onChange={onValueChange}
              required
            />
          </div>
          <div className="w-full">
            <label className="font-bold" htmlFor="password">
              {t("admin.password")} <span className="text-red-500">*</span>
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder={t("admin.password") || "Contraseña"}
              value={userInfo.password}
              onChange={onValueChange}
              required
            />
          </div>

          {error && (
            <div>
              <ul>
                {error.map((e, i) => (
                  <li className="text-red-500" key={i}>
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex w-full justify-end gap-4">
            <Button type="submit" disabled={isLoading}>
              {t("admin.save")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
