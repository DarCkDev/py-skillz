import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BackButton } from "../../components/shared/BackButton";
import { UserInfo } from "@/types";
import { deleteUser } from "./api/api";
import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { createPortal } from "react-dom";
import { ModalUpdateCreateUser } from "./ModalUpdateCreateUser";
import { useLoading } from "../../context/LoadingContext";
import { useToast } from "../../components/ui/use-toast";
export const UserManagement = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserInfo | undefined>(
    undefined
  );
    const { setLoading } = useLoading();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3003/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      console.log(data);
      setUsers(data);
      
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }finally {
      setLoading(false);
    }

  };

  const onDeleteUser = async (id: string) => {
    const mensaje = confirm(
      t("user.areYouSure") ||
        "¿Estás seguro de que quieres eliminar este usuario?"
    );
    if (mensaje) {
      try {
        const res = await deleteUser(id);
        console.log(res);
        if (res === true) {
          toast.success(t("user.userDeletedSuccessfully"));
          setUsers(users.filter((user) => user.id !== id));
        } else if (typeof res === "string") {
          toast.error(res);
        } else {
          toast.error(t("errors.unknown"));
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    }
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <BackButton />
      <div className="flex justify-between">
        <h1>{t("admin.userManagement")}</h1>
        <Button
          onClick={() => {
            setCurrentUser(undefined);
            openModal();
          }}
        >
          <PlusIcon width={18} height={18} />
          {t("admin.createUser")}
        </Button>
      </div>
      {showModal &&
        createPortal(
          <ModalUpdateCreateUser
            closeModal={closeModal}
            getUsers={fetchUsers}
            user={currentUser}
          />,
          document.body
        )}
        <div className="overflow-x-auto">
          <table className="w-full table-auto md:table-fixed">
            <thead className="text-left border-b border-foreground h-10">
              <tr>
                <th className="w-[48px]">#</th>
                <th className="min-w-[128px]">{t("admin.name")}</th>
                <th>{t("admin.email")}</th>
                <th>{t("admin.role")}</th>
                <th>{t("admin.createdAt")}</th>
                <th>{t("admin.updatedAt")}</th>
                <th>{t("admin.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr
                  key={user.id}
                  className="hover:bg-primary/10 transition-colors border-b border-foreground/30 h-12"
                >
                  <td className="w-[48px] truncate">{idx + 1}</td>
                  <td className="font-bold truncate">{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>
                    <p
                      className={`text-xs text-black rounded-full inline-block px-2 py-1 text-center ${user.role === "ADMIN" ? "bg-red-500" : user.role === "TEACHER" ? "bg-yellow-500" : "bg-blue-500"}`}
                    >
                      {user.role}
                    </p>
                  </td>
                  <td>
                    {new Date(user.createdAt).toLocaleDateString("es-ES")}
                  </td>
                  <td>
                    {new Date(user.updatedAt).toLocaleDateString("es-ES")}
                  </td>
                  <td className="flex gap-2">
                    <Button
                      onClick={() => {
                        setCurrentUser(user);
                        openModal();
                      }}
                    >
                      {t("admin.editUser")}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => onDeleteUser(user.id)}
                    >
                      {t("admin.deleteUser")}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  );
};
