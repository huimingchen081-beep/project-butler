#!/usr/bin/env python3
"""Compose demo video from PNG frames - direct filter approach (no intermediate clips)."""
import subprocess
import os

OUT_DIR = r"D:\project-butler\demo-frames"
OUT_VIDEO = r"D:\project-butler\demo-video.mp4"

frames = [
    ("frame_01_title.png", 10),
    ("frame_02_problem.png", 22),
    ("frame_03_solution.png", 20),
    ("frame_04_pipeline.png", 25),
    ("frame_05_webui.png", 30),
    ("frame_06_cli_planning.png", 28),
    ("frame_07_cli_generating.png", 35),
    ("frame_08_outputs.png", 30),
    ("frame_09_architecture.png", 30),
    ("frame_10_copilot.png", 28),
    ("frame_11_tech.png", 28),
    ("frame_12_impact.png", 22),
    ("frame_13_links.png", 20),
    ("frame_14_thanks.png", 12),
]

TRANSITION = 2.0
total_duration = sum(d for _, d in frames)
final_duration = total_duration - (len(frames) - 1) * TRANSITION
print(f"Total: {total_duration}s, Final: {final_duration:.0f}s ({final_duration//60:.0f}:{final_duration%60:.0f})")

# Build ffmpeg command with filter_complex
# Approach: generate each image as a video stream, then xfade chain
inputs = []
for i, (fname, dur) in enumerate(frames):
    fpath = os.path.join(OUT_DIR, fname)
    inputs.extend(["-loop", "1", "-t", str(dur), "-i", fpath])
    print(f"  Input {i}: {fname} ({dur}s)")

# Build filter complex
filters = []
# First, set SAR and format for each input
for i in range(len(frames)):
    filters.append(f"[{i}:v]setsar=1,fps=30,format=yuv420p[v{i}]")

# Then, chain xfade
filters.append(f"[v0][v1]xfade=transition=fade:duration={TRANSITION}:offset={frames[0][1]-TRANSITION}[x1]")
for i in range(2, len(frames)):
    offset = sum(frames[j][1] for j in range(i)) - i * TRANSITION
    filters.append(f"[x{i-1}][v{i}]xfade=transition=fade:duration={TRANSITION}:offset={offset}[x{i}]")

filter_complex = ";".join(filters)

cmd = [
    "ffmpeg", "-y",
    *inputs,
    "-filter_complex", filter_complex,
    f"-map", f"[x{len(frames)-1}]",
    "-c:v", "libx264", "-crf", "23", "-preset", "medium",
    "-pix_fmt", "yuv420p", "-r", "30",
    "-movflags", "+faststart",
    OUT_VIDEO
]

print(f"\nFilter chain: {len(filters)} nodes, {len(filter_complex)} chars")
print("Encoding (this may take 1-2 minutes)...")

result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
if result.returncode != 0:
    err = result.stderr[-800:]
    print(f"ERROR: {err}")
    exit(1)

size_mb = os.path.getsize(OUT_VIDEO) / (1024 * 1024)
print(f"\n✅ Video created: {OUT_VIDEO}")
print(f"   Size: {size_mb:.1f} MB, Duration: ~{final_duration:.0f}s")
