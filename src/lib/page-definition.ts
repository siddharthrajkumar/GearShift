import {
  CarIcon,
  LayoutDashboardIcon,
  ListIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";

export const DASHBOARD = {
  title: "Dashboard",
  url: "/dashboard",
  icon: LayoutDashboardIcon,
};

export const JOBS = {
  title: "Jobs",
  url: "/jobs",
  icon: ListIcon,
};

export const CUSTOMERS = {
  title: "Customers",
  url: "/customers",
  icon: UsersIcon,
};

export const VEHICLES = {
  title: "Vehicles",
  url: "/vehicles",
  icon: CarIcon,
};

export const SETTINGS = {
  title: "Settings",
  url: "/settings",
  icon: SettingsIcon,
};

export const MECHANICS = {
  title: "Mechanics",
  url: "/mechanics",
  icon: UsersIcon,
};

// Superadmin specific routes
export const SUPERADMIN_DASHBOARD = {
  title: "Dashboard",
  url: "/superadmin",
  icon: LayoutDashboardIcon,
};

export const SUPERADMIN_USERS = {
  title: "Users",
  url: "/superadmin/users",
  icon: UsersIcon,
};

export const SUPERADMIN_CUSTOMERS = {
  title: "Customers",
  url: "/superadmin/customers",
  icon: UsersIcon,
};

export const SUPERADMIN_VEHICLES = {
  title: "Vehicles",
  url: "/superadmin/vehicles",
  icon: CarIcon,
};

export const SUPERADMIN_INVENTORY_ITEMS = {
  title: "Inventory Items",
  url: "/superadmin/inventory-items",
  icon: ListIcon,
};
