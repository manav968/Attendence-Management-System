import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, CameraOff, Circle } from "lucide-react";

export function Webcam({ onCapture, autoStart = true }: { onCapture?: (dataUrl: string) => void; autoStart?: boolean }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    async function start() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setStreaming(true);
        }
      } catch (e) {
        setError("Camera access denied or unavailable.");
      }
    }
    if (autoStart) start();
    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [autoStart]);

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const data = canvas.toDataURL("image/jpeg", 0.92);
    onCapture?.(data);
  };

  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="aspect-video relative overflow-hidden rounded-md bg-black">
        {!streaming && !error && (
          <div className="absolute inset-0 grid place-items-center text-muted-foreground">
            <Camera className="h-10 w-10" />
          </div>
        )}
        {error && (
          <div className="absolute inset-0 grid place-items-center text-red-500 text-sm p-4 text-center">
            <CameraOff className="h-5 w-5 mr-2" /> {error}
          </div>
        )}
        <video ref={videoRef} className="h-full w-full object-cover" playsInline muted />
        <div className="absolute bottom-2 right-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-xs text-white">
            <Circle className="h-3 w-3 text-red-500" fill="currentColor" /> Live
          </span>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Center your face, good lighting helps liveness checks.</p>
        <Button size="sm" onClick={handleCapture}>Capture</Button>
      </div>
    </div>
  );
}
