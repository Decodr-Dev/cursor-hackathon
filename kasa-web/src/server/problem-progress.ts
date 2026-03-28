import { mkdir, readFile, writeFile } from "fs/promises";
import { dirname, join } from "path";
import type { ProblemStatus } from "@prisma/client";
import {
  defaultProgressStageForStatus,
  type ProblemProgressStage,
} from "@/lib/problem-progress";

type StoredProblemProgress = {
  stage: ProblemProgressStage;
  updatedAt: string;
};

type ProgressStore = Record<string, StoredProblemProgress>;

const PROGRESS_STORE_PATH = join(
  process.cwd(),
  "prisma",
  "demo-problem-progress.json",
);

export async function getProblemProgress(
  problemId: string,
  status: ProblemStatus,
) {
  const store = await readProgressStore();
  const stored = store[problemId];
  if (stored) return stored;
  return {
    stage: defaultProgressStageForStatus(status),
    updatedAt: new Date().toISOString(),
  };
}

export async function getProblemProgressMap(
  problems: Array<{ id: string; status: ProblemStatus }>,
) {
  const store = await readProgressStore();
  return Object.fromEntries(
    problems.map((problem) => [
      problem.id,
      store[problem.id] ?? {
        stage: defaultProgressStageForStatus(problem.status),
        updatedAt: problem.status === "COMMUNITY_VERIFIED"
          ? new Date().toISOString()
          : new Date().toISOString(),
      },
    ]),
  ) as Record<string, StoredProblemProgress>;
}

export async function setProblemProgressStage(
  problemId: string,
  stage: ProblemProgressStage,
) {
  const store = await readProgressStore();
  store[problemId] = {
    stage,
    updatedAt: new Date().toISOString(),
  };
  await writeProgressStore(store);
  return store[problemId];
}

async function readProgressStore(): Promise<ProgressStore> {
  try {
    const raw = await readFile(PROGRESS_STORE_PATH, "utf8");
    return JSON.parse(raw) as ProgressStore;
  } catch {
    return {};
  }
}

async function writeProgressStore(store: ProgressStore) {
  await mkdir(dirname(PROGRESS_STORE_PATH), { recursive: true });
  await writeFile(PROGRESS_STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}
