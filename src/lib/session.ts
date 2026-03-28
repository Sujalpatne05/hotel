const safeGet = (storage: Storage, key: string) => {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
};

const safeSet = (storage: Storage, key: string, value: string) => {
  try {
    storage.setItem(key, value);
  } catch {
    // Ignore storage failures and rely on available storage.
  }
};

const safeRemove = (storage: Storage, key: string) => {
  try {
    storage.removeItem(key);
  } catch {
    // Ignore storage failures.
  }
};

export const saveAuthSession = (
  token: string,
  role: string,
  userName: string,
  restaurantName = "",
  restaurantId: number | null = null,
  mustChangePassword = false,
  userId: number | null = null,
) => {
  safeSet(localStorage, "authToken", token);
  safeSet(localStorage, "userRole", role);
  safeSet(localStorage, "userName", userName);
  safeSet(localStorage, "restaurantName", restaurantName);
  safeSet(localStorage, "restaurantId", restaurantId === null ? "" : String(restaurantId));
  safeSet(localStorage, "userId", userId === null ? "" : String(userId));
  safeSet(localStorage, "isAdmin", String(role === "admin"));
  safeSet(localStorage, "isSuperAdmin", String(role === "superadmin"));
  safeSet(localStorage, "mustChangePassword", String(mustChangePassword));

  // Session storage fallback helps when localStorage is unavailable/restricted.
  safeSet(sessionStorage, "authToken", token);
  safeSet(sessionStorage, "userRole", role);
  safeSet(sessionStorage, "userName", userName);
  safeSet(sessionStorage, "restaurantName", restaurantName);
  safeSet(sessionStorage, "restaurantId", restaurantId === null ? "" : String(restaurantId));
  safeSet(sessionStorage, "userId", userId === null ? "" : String(userId));
  safeSet(sessionStorage, "isAdmin", String(role === "admin"));
  safeSet(sessionStorage, "isSuperAdmin", String(role === "superadmin"));
  safeSet(sessionStorage, "mustChangePassword", String(mustChangePassword));
};

export const getStoredRole = () => {
  return safeGet(localStorage, "userRole") || safeGet(sessionStorage, "userRole");
};

export const clearAuthSession = () => {
  safeRemove(localStorage, "authToken");
  safeRemove(localStorage, "userRole");
  safeRemove(localStorage, "userName");
  safeRemove(localStorage, "restaurantName");
  safeRemove(localStorage, "restaurantId");
  safeRemove(localStorage, "userId");
  safeRemove(localStorage, "isAdmin");
  safeRemove(localStorage, "isSuperAdmin");
  safeRemove(localStorage, "mustChangePassword");

  safeRemove(sessionStorage, "authToken");
  safeRemove(sessionStorage, "userRole");
  safeRemove(sessionStorage, "userName");
  safeRemove(sessionStorage, "restaurantName");
  safeRemove(sessionStorage, "restaurantId");
  safeRemove(sessionStorage, "userId");
  safeRemove(sessionStorage, "isAdmin");
  safeRemove(sessionStorage, "isSuperAdmin");
  safeRemove(sessionStorage, "mustChangePassword");
};

export const getAuthToken = () => safeGet(localStorage, "authToken") || safeGet(sessionStorage, "authToken");

export const getStoredRestaurantName = () => {
  return safeGet(localStorage, "restaurantName") || safeGet(sessionStorage, "restaurantName") || "";
};

export const getStoredRestaurantId = () => {
  const value = safeGet(localStorage, "restaurantId") || safeGet(sessionStorage, "restaurantId") || "";
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

export const getStoredUserId = () => {
  const value = safeGet(localStorage, "userId") || safeGet(sessionStorage, "userId") || "";
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

export const isPasswordChangeRequired = () => {
  const value = safeGet(localStorage, "mustChangePassword") || safeGet(sessionStorage, "mustChangePassword");
  return value === "true";
};

export const setPasswordChangeRequired = (required: boolean) => {
  safeSet(localStorage, "mustChangePassword", String(required));
  safeSet(sessionStorage, "mustChangePassword", String(required));
};

export const buildAuthHeaders = () => {
  const token = getAuthToken();
  if (!token) return null;
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const isAuthError = (status: number) => status === 401 || status === 403;
