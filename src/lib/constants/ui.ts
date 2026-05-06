export const UI_CONSTANTS = {
  clientRefreshMs: 30_000,
  toastSuccessMs: 3_000,
  toastErrorMs: 5_000,
  defaultAutoRotateSeconds: Number(
    process.env.NEXT_PUBLIC_AUTO_ROTATE_INTERVAL ?? 30,
  ),
} as const;
