import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UserInfo, EditCreateUser } from "@/types";
import { Input } from "@/components/ui/input";
import { createUser, updateUser } from "./api/api";
import { useTranslation } from "react-i18next";
import { useToast } from "../../components/ui/use-toast";

const INITIAL: EditCreateUser = {
  id: "",
  fullName: "",
  email: "",
  role: "STUDENT",
};

export const ModalUpdateCreateUser = ({
  closeModal,
  getUsers,
  user,
}: {
  closeModal: () => void;
  getUsers: () => Promise<void>;
  user?: UserInfo;
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [userInfo, setUserInfo] = useState<EditCreateUser>(INITIAL);
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
      if (user) {
        const res = await updateUser(userInfo);
        if (typeof res === "string") {
          setError([res]);
        } else if ("error" in res) {
          setError(res.message);
        } else {
          closeModal();
          toast.success(t("user.userUpdatedSuccessfully"));
          await getUsers();
        }
      } else {
        const res = await createUser(userInfo);
        if (typeof res === "string") {
          setError([res]);
        } else if ("error" in res) {
          setError(res.message);
        } else {
          closeModal();
          toast.success(t("user.userCreatedSuccessfully"));
          await getUsers();
        }
      }
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      setError([t("errors.unknown")]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setUserInfo(user);
    }
  }, [user]);

  return (
    <div className="absolute top-0 w-screen h-screen bg-black/50 flex items-center justify-center">
      <form
        className="flex flex-col gap-4 shadow bg-background rounded items-center p-5 w-11/12 md:w-2/3 lg:w-1/3 max-h-screen overflow-y-auto"
        onSubmit={onSubmit}
      >
        <p className="p-0 font-bold text-xl">
          {user ? t("admin.update") : t("admin.create")}
        </p>
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
        {!user && (
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
        )}
        <div className="w-full">
          <label className="font-bold" htmlFor="role">
            {t("admin.role")} <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full bg-background rounded-md border border-foreground px-3 py-2 text-sm shadow-sm"
            value={userInfo.role}
            onChange={onValueChange}
            name="role"
            required
          >
            <option value="ADMIN">{t("admin.admin")}</option>
            <option value="TEACHER">{t("admin.teacher")}</option>
            <option value="STUDENT">{t("admin.student")}</option>
          </select>
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
          <Button
            type="button"
            variant="secondary"
            disabled={isLoading}
            onClick={closeModal}
          >
            {t("admin.close")}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {t("admin.save")}
          </Button>
        </div>
      </form>
    </div>
  );
};
