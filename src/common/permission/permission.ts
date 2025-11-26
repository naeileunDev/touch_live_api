import { UserRole } from "../../user/enum/user-role.enum";

export const ALL_PERMISSION = [UserRole.Admin, UserRole.Manager, UserRole.User];

export const OPERATOR_PERMISSION = [UserRole.Admin, UserRole.Manager];

export const ADMIN_PERMISSION = [UserRole.Admin];

export const MANAGER_PERMISSION = [UserRole.Manager];

export const USER_PERMISSION = [UserRole.User];

export const ANY_PERMISSION = [];