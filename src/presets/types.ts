export const PRESET_NAMES = [
  "all",
  "api",
  "build",
  "bin",
  "codegen",
  "codespaces",
  "eslint",
  "git",
  "githubPackage",
  "macros",
  "node",
  "prettier",
  "react",
  "sql",
  "typescript",
  "vite",
  "vitest",
  "yarn",
] as const

export type PresetName = typeof PRESET_NAMES[number]

export const isPresetName = (name: string): name is PresetName => {
  return PRESET_NAMES.includes(name as PresetName)
}

export type Presets = readonly PresetName[]
