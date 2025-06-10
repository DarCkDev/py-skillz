import React, { useEffect, useState } from "react";
import { BackButton } from "../../components/shared/BackButton";
import { Link } from "../../components/ui/link";
import { useTranslation } from "react-i18next";
import { Users, BookOpen, BarChart } from "lucide-react";
import { countUsers } from "./api/api";

export const AdminPanel = () => {
  const { t } = useTranslation();

  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalStudents, setTotalStudents] = useState<number>(0);

  const getTotal = async () => {
    const getUsers = await countUsers();
    setTotalUsers(getUsers);
    const getStudents = await countUsers("STUDENT");
    setTotalStudents(getStudents);
  };

  useEffect(() => {
    getTotal();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <BackButton />
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold ml-2">{t("admin.panelTitle")}</h1>
      </div>

      <p className="text-muted-foreground mb-8">
        {t("admin.panelDescription")}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/admin/users"
          className="block p-6 bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full mr-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">
              {t("admin.userManagement")}
            </h2>
          </div>
          <p className="text-muted-foreground">
            {t("admin.userManagementDescription")}
          </p>
        </Link>

        <Link
          to="/admin/courses"
          className="block p-6 bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full mr-4">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">
              {t("admin.courseManagement")}
            </h2>
          </div>
          <p className="text-muted-foreground">
            {t("admin.courseManagementDescription")}
          </p>
        </Link>

        <Link
          to="/reports"
          className="block p-6 bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full mr-4">
              <BarChart className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">{t("admin.reports")}</h2>
          </div>
          <p className="text-muted-foreground">
            {t("admin.reportsDescription")}
          </p>
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-card rounded-lg border border-border shadow-sm">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            {t("admin.totalUsers")}
          </h3>
          <p className="text-3xl font-bold">{totalUsers}</p>
        </div>

        <div className="p-6 bg-card rounded-lg border border-border shadow-sm">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            {t("admin.totalCourses")}
          </h3>
          <p className="text-3xl font-bold">25</p>
        </div>

        <div className="p-6 bg-card rounded-lg border border-border shadow-sm">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            {t("admin.activeStudents")}
          </h3>
          <p className="text-3xl font-bold">{totalStudents}</p>
        </div>
      </div>
    </div>
  );
};
