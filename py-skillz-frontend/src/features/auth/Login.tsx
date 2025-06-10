import React, { useState, useContext } from "react";
import { ILogin } from "../../types";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLoading } from "../../context/LoadingContext";
import { useToast } from "../../components/ui/use-toast";

export const Login = () => {
  const [data, setData] = useState<ILogin>({ email: "", password: "" });
  const [errors, setErrors] = useState<string[]>([]);
  const auth = useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setLoading } = useLoading();

  const onDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Set loading to true before API call
    if (!auth) {
      setErrors(["Authentication context not available"]);
      setLoading(false); // Clear loading if auth context is missing
      return;
    }
    
    try {
      const loginErrors = await auth.login(data);
      if (loginErrors) {
        setErrors(loginErrors);
      } else {
        toast.success(t("auth.loginSuccessful"));
        navigate("/admin"); // Redirige al dashboard u otra ruta
      }
    } finally {
      setLoading(false); // Clear loading after API call completes
    }
  };

  return (
    <div className="flex flex-col items-center justify-center 
      min-h-[calc(100vh-100px)] bg-gray-100 dark:bg-gray-900">
      
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold">
            {t("auth.login")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmitForm} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">
                  {t("auth.email") ?? "Email"}
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("auth.email") ?? "Email"}
                  name="email"
                  value={data.email}
                  onChange={onDataChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  {t("auth.password") ?? "Password"}
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t("auth.password") ?? "Password"}
                  name="password"
                  value={data.password}
                  onChange={onDataChange}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              {t("auth.login")}
            </Button>
            {errors.length > 0 && (
              <ul className="text-red-500 text-sm list-disc pl-5 mt-2">
                {errors.map((err, index) => (
                  <li key={index}>{err}</li>
                ))}
              </ul>
            )}
          </form>
          <div className="mt-4 text-center text-sm">
            {t("auth.noAccount")}{" "}
            <Link to="/register" className="underline" onClick={() => setLoading(true)}>
              {t("auth.register")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
