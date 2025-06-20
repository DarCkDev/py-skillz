import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateStudent } from "@/types";
import { useTranslation } from "react-i18next";
import { createStudent } from "../admin/api/api";
import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useLoading } from "../../context/LoadingContext";
import { useToast } from "../../components/ui/use-toast";

const INITIAL: CreateStudent = {
  fullName: "",
  email: "",
  password: "",
};

export const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isAuthenticated = useContext(AuthContext)?.isAuthenticated;
  const { toast } = useToast();
  const [userInfo, setUserInfo] = useState<CreateStudent>(INITIAL);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string[] | undefined>(undefined);
  const { setLoading } = useLoading();

  const onValueChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Set loading to true before API call
    setIsLoading(true);
    setError(undefined);
    try {
      const res = await createStudent(userInfo);
      if (typeof res === "string") {
        setError([res]);
      } else if ("error" in res) {
        setError(res.message);
      } else {
        toast.success(t("user.userCreatedSuccessfully"));
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      setError([t("errors.unknown")]);
    } finally {
      setIsLoading(false);
      setLoading(false); // Clear loading after API call completes
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex flex-col items-center justify-center 
      min-h-[calc(100vh-100px)] bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold">
            {t("admin.create")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="fullName" className="font-bold sr-only">
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
              <div>
                <label htmlFor="email" className="font-bold sr-only">
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
              <div>
                <label htmlFor="password" className="font-bold sr-only">
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
            </div>
            {error && (
              <ul className="text-red-500 text-sm list-disc pl-5 mt-2">
                {error.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            )}
            <Button type="submit" disabled={isLoading} className="w-full">
              {t("admin.save")}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            {t("auth.alreadyHaveAccount")}{" "}
            <Link to="/login" className="underline" onClick={() => setLoading(true)}>
              {t("auth.login")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
