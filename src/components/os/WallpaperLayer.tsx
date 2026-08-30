import { useEffect, useRef, useState } from "react";
import { useOS } from "../../core/OSContext";
import { findWallpaperPreset } from "../../core/wallpaperPresets";
import { loadCustomWallpaper } from "../../core/customWallpaperStore";

export default function WallpaperLayer() {
  const { state } = useOS();
  const { id, dim, blur } = state.settings.wallpaper;
  const reducedMotion = state.settings.reducedMotion;

  const preset = id === "custom" ? null : findWallpaperPreset(id);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [customUrl, setCustomUrl] = useState<string | null>(null);
  const [customKind, setCustomKind] = useState<"video" | "image" | null>(null);

  useEffect(() => {
    if (id !== "custom") {
      setCustomUrl(null);
      setCustomKind(null);
      return;
    }

    let cancelled = false;
    let objectUrl: string | null = null;

    loadCustomWallpaper().then((stored) => {
      if (cancelled || !stored) return;
      objectUrl = URL.createObjectURL(stored.blob);
      setCustomUrl(objectUrl);
      setCustomKind(stored.kind);
    });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [id]);

  useEffect(() => {
    function onVisibility() {
      const video = videoRef.current;
      if (!video) return;
      if (document.hidden || reducedMotion) video.pause();
      else video.play().catch(() => {});
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [reducedMotion]);

  const isVideo = preset?.kind === "video" || (id === "custom" && customKind === "video");
  const videoSrc = preset?.kind === "video" ? preset.src : id === "custom" ? customUrl ?? undefined : undefined;
  const imageSrc = id === "custom" && customKind === "image" ? customUrl ?? undefined : undefined;
  const gradient = preset?.kind === "gradient" ? preset.swatch : undefined;

  return (
    <div className="wallpaper" style={blur ? { filter: `blur(${blur}px)` } : undefined}>
      {isVideo && videoSrc && (
        <video
          ref={videoRef}
          className="wallpaper-media"
          src={videoSrc}
          poster={preset?.poster}
          autoPlay={!reducedMotion}
          loop
          muted
          playsInline
        />
      )}
      {imageSrc && <img className="wallpaper-media" src={imageSrc} alt="" />}
      {gradient && <div className="wallpaper-media wallpaper-gradient" style={{ background: gradient }} />}
      <div className="wallpaper-dim" style={{ opacity: dim / 100 }} />
      <div className="wallpaper-noise" />
    </div>
  );
}
