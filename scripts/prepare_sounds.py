import os
import subprocess
import urllib.request
import imageio_ffmpeg

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend", "public", "assets", "sound")
TEMP_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend", "public", "assets", "sound", "_temp")

os.makedirs(OUT_DIR, exist_ok=True)
os.makedirs(TEMP_DIR, exist_ok=True)

# Sources list (all verified CC0 1.0 Universal)
SOURCES = {
    "move": {
        "url": "https://raw.githubusercontent.com/sharechess/sharechess/main/public/sfx/move.mp3",
        "duration": "0.12", # 120ms
        "author": "mh2o (Freesound #351518)",
        "license": "CC0 1.0 Universal"
    },
    "capture": {
        "url": "https://raw.githubusercontent.com/sharechess/sharechess/main/public/sfx/anarchy/brick-take.mp3",
        "duration": "0.14", # 140ms
        "author": "dichardson (Freesound #570964)",
        "license": "CC0 1.0 Universal"
    },
    "check": {
        "url": "https://raw.githubusercontent.com/sharechess/sharechess/main/public/sfx/snap.mp3",
        "duration": "0.13", # 130ms
        "author": "alegemaate (Freesound #364699)",
        "license": "CC0 1.0 Universal"
    },
    "castle": {
        "url": "https://raw.githubusercontent.com/sharechess/sharechess/main/public/sfx/anarchy/brick-castle.mp3",
        "duration": "0.15", # 150ms
        "author": "SieuAmThanh (Freesound #530812)",
        "license": "CC0 1.0 Universal"
    },
    "promote": {
        "url": "https://raw.githubusercontent.com/Calinou/kenney-interface-sounds/master/addons/kenney_interface_sounds/drop_001.wav",
        "duration": "0.14", # 140ms
        "author": "Kenney (kenney.nl)",
        "license": "CC0 1.0 Universal"
    },
    "illegal": {
        "url": "https://raw.githubusercontent.com/sharechess/sharechess/main/public/sfx/anarchy/hit.mp3",
        "duration": "0.11", # 110ms
        "author": "SypherZent (Freesound #420673)",
        "license": "CC0 1.0 Universal"
    },
    "game_start": {
        "url": "https://raw.githubusercontent.com/Calinou/kenney-interface-sounds/master/addons/kenney_interface_sounds/open_001.wav",
        "duration": "0.15", # 150ms
        "author": "Kenney (kenney.nl)",
        "license": "CC0 1.0 Universal"
    },
    "game_end": {
        "url": "https://raw.githubusercontent.com/sharechess/sharechess/main/public/sfx/anarchy/checkmate.mp3",
        "duration": "0.15", # 150ms
        "author": "stumpbutt (Freesound #381688)",
        "license": "CC0 1.0 Universal"
    },
    "puzzle_correct": {
        "url": "https://raw.githubusercontent.com/Calinou/kenney-interface-sounds/master/addons/kenney_interface_sounds/confirmation_002.wav",
        "duration": "0.15", # 150ms
        "author": "Kenney (kenney.nl)",
        "license": "CC0 1.0 Universal"
    },
    "puzzle_wrong": {
        "url": "https://raw.githubusercontent.com/Calinou/kenney-interface-sounds/master/addons/kenney_interface_sounds/error_001.wav",
        "duration": "0.14", # 140ms
        "author": "Kenney (kenney.nl)",
        "license": "CC0 1.0 Universal"
    }
}

print(f"Preparing {len(SOURCES)} CC0 sound effects...")

for name, meta in SOURCES.items():
    raw_path = os.path.join(TEMP_DIR, f"{name}_raw" + os.path.splitext(meta["url"])[1])
    mp3_path = os.path.join(OUT_DIR, f"{name}.mp3")
    ogg_path = os.path.join(OUT_DIR, f"{name}.ogg")
    
    print(f"Downloading {name} from {meta['url']}...")
    req = urllib.request.Request(meta["url"], headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req) as resp, open(raw_path, "wb") as f:
        f.write(resp.read())
    
    # Process MP3 with loudnorm to -16 LUFS and fadeout
    # Filter: loudnorm to -16 LUFS, trim duration, apply 10ms smooth fadeout at the end
    dur = float(meta["duration"])
    fade_start = max(0.02, dur - 0.015)
    af_filter = f"loudnorm=I=-16:TP=-1.5:LRA=7,afade=t=out:st={fade_start:.3f}:d=0.015"
    
    cmd_mp3 = [
        FFMPEG, "-y", "-i", raw_path,
        "-t", meta["duration"],
        "-af", af_filter,
        "-c:a", "libmp3lame", "-b:a", "128k",
        mp3_path
    ]
    subprocess.run(cmd_mp3, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    cmd_ogg = [
        FFMPEG, "-y", "-i", raw_path,
        "-t", meta["duration"],
        "-af", af_filter,
        "-c:a", "libvorbis", "-q:a", "4",
        ogg_path
    ]
    subprocess.run(cmd_ogg, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    print(f"Generated {name}.mp3 ({os.path.getsize(mp3_path)} B) and {name}.ogg ({os.path.getsize(ogg_path)} B)")

# Clean up temp
for f in os.listdir(TEMP_DIR):
    os.remove(os.path.join(TEMP_DIR, f))
os.rmdir(TEMP_DIR)

print("All sound assets generated successfully!")
