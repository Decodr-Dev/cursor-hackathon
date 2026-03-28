import {
  createHash,
  randomBytes,
  scrypt as nodeScrypt,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const scrypt = promisify(nodeScrypt);

const AUTH_COOKIE = "kasa_auth";
const AUTH_MAX_AGE = 60 * 60 * 24 * 30;
const PASSWORD_KEYLEN = 64;

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
} as const;

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
};

type AuthMutationResult =
  | { ok: true; user: AuthUser }
  | { ok: false; error: string; status: number };

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(password, salt, PASSWORD_KEYLEN)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

async function verifyPassword(password: string, stored: string) {
  const [salt, digest] = stored.split(":");
  if (!salt || !digest) return false;

  const expected = Buffer.from(digest, "hex");
  const actual = (await scrypt(password, salt, PASSWORD_KEYLEN)) as Buffer;

  if (expected.length !== actual.length) return false;
  return timingSafeEqual(expected, actual);
}

async function setAuthCookie(token: string) {
  const store = await cookies();
  store.set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: AUTH_MAX_AGE,
  });
}

async function clearAuthCookie() {
  const store = await cookies();
  store.set(AUTH_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

async function getAuthTokenFromCookie() {
  const store = await cookies();
  return store.get(AUTH_COOKIE)?.value;
}

async function createSessionForUser(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + AUTH_MAX_AGE * 1000);

  await prisma.authSession.create({
    data: {
      userId,
      tokenHash: hashSessionToken(token),
      expiresAt,
    },
  });

  await setAuthCookie(token);
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const token = await getAuthTokenFromCookie();
  if (!token) return null;

  const session = await prisma.authSession.findUnique({
    where: { tokenHash: hashSessionToken(token) },
    include: { user: { select: publicUserSelect } },
  });

  if (!session || session.expiresAt <= new Date()) {
    return null;
  }

  return session.user;
}

export async function signUpWithPassword(input: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}): Promise<AuthMutationResult> {
  const name = input.name.trim();
  const email = normalizeEmail(input.email);
  const password = input.password;
  const confirmPassword = input.confirmPassword;

  if (name.length < 2) {
    return {
      ok: false,
      error: "Enter the name you want shown on your Kasa profile.",
      status: 400,
    };
  }
  if (!isValidEmail(email)) {
    return {
      ok: false,
      error: "Enter a valid email address.",
      status: 400,
    };
  }
  if (password.length < 8) {
    return {
      ok: false,
      error: "Use at least 8 characters for your password.",
      status: 400,
    };
  }
  if (password !== confirmPassword) {
    return {
      ok: false,
      error: "Your passwords do not match.",
      status: 400,
    };
  }

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existing) {
    return {
      ok: false,
      error: "That email already has a Kasa account. Try logging in instead.",
      status: 409,
    };
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, passwordHash },
    select: publicUserSelect,
  });

  await createSessionForUser(user.id);

  return { ok: true, user };
}

export async function loginWithPassword(input: {
  email: string;
  password: string;
}): Promise<AuthMutationResult> {
  const email = normalizeEmail(input.email);
  const password = input.password;

  if (!isValidEmail(email) || password.length === 0) {
    return {
      ok: false,
      error: "Enter your email and password.",
      status: 400,
    };
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      ...publicUserSelect,
      passwordHash: true,
    },
  });

  if (!user) {
    return {
      ok: false,
      error: "No account matched that email and password.",
      status: 401,
    };
  }

  const passwordOk = await verifyPassword(password, user.passwordHash);
  if (!passwordOk) {
    return {
      ok: false,
      error: "No account matched that email and password.",
      status: 401,
    };
  }

  await createSessionForUser(user.id);

  return {
    ok: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
  };
}

export async function logoutCurrentUser() {
  const token = await getAuthTokenFromCookie();

  if (token) {
    await prisma.authSession.deleteMany({
      where: { tokenHash: hashSessionToken(token) },
    });
  }

  await clearAuthCookie();
}
