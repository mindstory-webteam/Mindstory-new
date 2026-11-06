/** Starfield + orange glow used behind the dark hero sections. */
export default function SpaceBackdrop() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 12% 22%, rgba(255,255,255,.7) 50%, transparent 51%)," +
            "radial-gradient(1px 1px at 78% 18%, rgba(255,255,255,.5) 50%, transparent 51%)," +
            "radial-gradient(1.5px 1.5px at 34% 72%, rgba(255,255,255,.6) 50%, transparent 51%)," +
            "radial-gradient(1px 1px at 88% 64%, rgba(255,255,255,.6) 50%, transparent 51%)," +
            "radial-gradient(1px 1px at 56% 38%, rgba(255,255,255,.4) 50%, transparent 51%)," +
            "radial-gradient(1.5px 1.5px at 6% 84%, rgba(255,255,255,.5) 50%, transparent 51%)," +
            "radial-gradient(1px 1px at 66% 88%, rgba(255,255,255,.5) 50%, transparent 51%)",
          backgroundSize: "640px 640px",
        }}
      />
      <div aria-hidden className="pointer-events-none absolute -right-40 top-1/3 -z-10 h-[560px] w-[560px] rounded-full bg-brand/20 blur-[130px]" />
    </>
  );
}
