/** @vitest-environment node */

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";

type LoginResponse = {
  token: string;
};

const dbUrl = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;
const hasDb = Boolean(dbUrl);
const port = Number(process.env.TEST_BACKEND_PORT || 5117);
const baseUrl = `http://127.0.0.1:${port}`;

let backendProcess: ChildProcessWithoutNullStreams | null = null;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const waitForHealth = async () => {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/health`);
      if (response.ok) return;
    } catch {
      // Keep polling until backend starts or timeout is reached.
    }
    await wait(500);
  }
  throw new Error("Backend did not become healthy in time");
};

const apiRequest = async (path: string, init: RequestInit = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };
  const response = await fetch(`${baseUrl}${path}`, { ...init, headers });
  const payload = await response.json().catch(() => ({}));
  return { response, payload };
};

const login = async (email: string, password: string) => {
  const { response, payload } = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username: email, password }),
  });
  expect(response.status).toBe(200);
  return payload as LoginResponse;
};

const describeIfDb = hasDb ? describe : describe.skip;

describeIfDb("Tenant isolation integration", () => {
  beforeAll(async () => {
    backendProcess = spawn(process.execPath, ["server/postgres-backend.mjs"], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        PORT: String(port),
        DATABASE_URL: String(dbUrl),
      },
      stdio: "pipe",
    });

    backendProcess.on("error", (error) => {
      throw error;
    });

    await waitForHealth();
  }, 30_000);

  afterAll(async () => {
    if (!backendProcess || backendProcess.killed) return;
    backendProcess.kill("SIGTERM");
    await wait(500);
  });

  it("blocks admin cross-tenant access to CRM records, but allows superadmin visibility", async () => {
    const suffix = Date.now();
    const admin1Email = `tenant.a.${suffix}@example.com`;
    const admin2Email = `tenant.b.${suffix}@example.com`;
    const adminPassword = "TempPass123";

    const superadminEmail = process.env.SUPERADMIN_EMAIL || "superadmin@restrohub.local";
    const superadminPassword = process.env.SUPERADMIN_PASSWORD || "super123";
    const superadmin = await login(superadminEmail, superadminPassword);

    const createAdmin = async (name: string, email: string, restaurantName: string) => {
      const { response } = await apiRequest("/superadmin/users", {
        method: "POST",
        headers: { Authorization: `Bearer ${superadmin.token}` },
        body: JSON.stringify({
          name,
          email,
          restaurantName,
          temporaryPassword: adminPassword,
        }),
      });
      expect([200, 201]).toContain(response.status);
    };

    await createAdmin("Tenant A Admin", admin1Email, `Tenant-A-${suffix}`);
    await createAdmin("Tenant B Admin", admin2Email, `Tenant-B-${suffix}`);

    const admin1 = await login(admin1Email, adminPassword);
    const admin2 = await login(admin2Email, adminPassword);

    const created = await apiRequest("/crm/customers", {
      method: "POST",
      headers: { Authorization: `Bearer ${admin1.token}` },
      body: JSON.stringify({
        name: `Customer-${suffix}`,
        email: `customer.${suffix}@example.com`,
        phone: "+91 9000000000",
        visits: 1,
        totalSpent: 100,
        vip: false,
      }),
    });

    expect(created.response.status).toBe(201);
    const createdCustomerId = created.payload.id as number;
    expect(typeof createdCustomerId).toBe("number");

    const listForAdmin2 = await apiRequest("/crm/customers", {
      headers: { Authorization: `Bearer ${admin2.token}` },
    });
    expect(listForAdmin2.response.status).toBe(200);
    const admin2Ids = (listForAdmin2.payload as Array<{ id: number }>).map((customer) => customer.id);
    expect(admin2Ids).not.toContain(createdCustomerId);

    const patchByAdmin2 = await apiRequest(`/crm/customers/${createdCustomerId}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${admin2.token}` },
      body: JSON.stringify({ name: "Cross-Tenant Attempt" }),
    });
    expect(patchByAdmin2.response.status).toBe(404);

    const deleteByAdmin2 = await apiRequest(`/crm/customers/${createdCustomerId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${admin2.token}` },
    });
    expect(deleteByAdmin2.response.status).toBe(404);

    const listForSuperadmin = await apiRequest("/crm/customers", {
      headers: { Authorization: `Bearer ${superadmin.token}` },
    });
    expect(listForSuperadmin.response.status).toBe(200);
    const superadminIds = (listForSuperadmin.payload as Array<{ id: number }>).map((customer) => customer.id);
    expect(superadminIds).toContain(createdCustomerId);
  }, 45_000);

  it("blocks admin cross-tenant updates for recipes", async () => {
    const suffix = Date.now() + 1000;
    const admin1Email = `recipes.a.${suffix}@example.com`;
    const admin2Email = `recipes.b.${suffix}@example.com`;
    const adminPassword = "TempPass123";

    const superadminEmail = process.env.SUPERADMIN_EMAIL || "superadmin@restrohub.local";
    const superadminPassword = process.env.SUPERADMIN_PASSWORD || "super123";
    const superadmin = await login(superadminEmail, superadminPassword);

    const createAdmin = async (name: string, email: string, restaurantName: string) => {
      const { response } = await apiRequest("/superadmin/users", {
        method: "POST",
        headers: { Authorization: `Bearer ${superadmin.token}` },
        body: JSON.stringify({
          name,
          email,
          restaurantName,
          temporaryPassword: adminPassword,
        }),
      });
      expect([200, 201]).toContain(response.status);
    };

    await createAdmin("Recipe Tenant A", admin1Email, `Recipe-A-${suffix}`);
    await createAdmin("Recipe Tenant B", admin2Email, `Recipe-B-${suffix}`);

    const admin1 = await login(admin1Email, adminPassword);
    const admin2 = await login(admin2Email, adminPassword);

    const recipeCreate = await apiRequest("/recipes", {
      method: "POST",
      headers: { Authorization: `Bearer ${admin1.token}` },
      body: JSON.stringify({
        name: `Recipe-${suffix}`,
        category: "Main Course",
        prepTime: 18,
        stock: "Available",
        image: "",
        ingredients: "Testing ingredients",
      }),
    });
    expect(recipeCreate.response.status).toBe(201);
    const recipeId = recipeCreate.payload.id as number;

    const patchByAdmin2 = await apiRequest(`/recipes/${recipeId}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${admin2.token}` },
      body: JSON.stringify({ name: "Should Not Update" }),
    });
    expect(patchByAdmin2.response.status).toBe(404);

    const listForAdmin2 = await apiRequest("/recipes", {
      headers: { Authorization: `Bearer ${admin2.token}` },
    });
    expect(listForAdmin2.response.status).toBe(200);
    const admin2RecipeIds = (listForAdmin2.payload as Array<{ id: number }>).map((recipe) => recipe.id);
    expect(admin2RecipeIds).not.toContain(recipeId);

    const listForSuperadmin = await apiRequest("/recipes", {
      headers: { Authorization: `Bearer ${superadmin.token}` },
    });
    expect(listForSuperadmin.response.status).toBe(200);
    const superadminRecipeIds = (listForSuperadmin.payload as Array<{ id: number }>).map((recipe) => recipe.id);
    expect(superadminRecipeIds).toContain(recipeId);
  }, 45_000);
});
