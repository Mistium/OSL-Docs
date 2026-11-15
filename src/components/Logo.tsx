/* The OSL mark, from OSL's Rotur avatar, so it changes when the avatar does. */
export const LOGO = "https://avatars.rotur.dev/osl";

export function Logo({ size = 26 }: { size?: number }) {
  return <img class="logo" src={LOGO} width={size} height={size} alt="" decoding="async" />;
}
