import os
import subprocess
import numpy as np
import scipy.io.wavfile as wav
import imageio_ffmpeg

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(SCRIPT_DIR, "..", "frontend", "public", "assets", "sound")
TEMP_DIR = os.path.join(SCRIPT_DIR, "..", "frontend", "public", "assets", "sound", "_temp")

os.makedirs(OUT_DIR, exist_ok=True)
os.makedirs(TEMP_DIR, exist_ok=True)

SR = 44100

def generate_move():
    # 85ms short, bright click
    dur = 0.085
    t = np.linspace(0, dur, int(SR * dur), endpoint=False)
    # High-freq sharp click transient (0-4ms)
    transient = np.random.uniform(-1, 1, len(t)) * np.exp(-t / 0.0025)
    click_tone = np.sin(2 * np.pi * 3800 * t) * np.exp(-t / 0.003)
    # Wood body resonance
    wood1 = np.sin(2 * np.pi * 920 * t) * np.exp(-t / 0.030)
    wood2 = np.sin(2 * np.pi * 1450 * t) * np.exp(-t / 0.018)
    wood3 = np.sin(2 * np.pi * 2300 * t) * np.exp(-t / 0.012)
    sig = 0.5 * transient + 0.4 * click_tone + 0.45 * wood1 + 0.25 * wood2 + 0.15 * wood3
    # Envelope
    env = np.ones_like(t)
    fade_len = int(SR * 0.015)
    env[-fade_len:] = np.linspace(1, 0, fade_len)
    return sig * env, dur

def generate_capture():
    # 125ms heavier double click (piece hit piece, then piece hit board)
    dur = 0.125
    t = np.linspace(0, dur, int(SR * dur), endpoint=False)
    # Strike 1 at t=0: piece-piece impact (higher pitch, sharp click)
    t1 = t
    strike1_click = (np.random.uniform(-1, 1, len(t1)) * np.exp(-t1 / 0.003) +
                     np.sin(2 * np.pi * 3400 * t1) * np.exp(-t1 / 0.004) +
                     0.6 * np.sin(2 * np.pi * 1650 * t1) * np.exp(-t1 / 0.020))
    # Strike 2 at t=22ms: piece-board impact (heavier thud, lower wood body)
    delay_samples = int(SR * 0.022)
    t2 = np.zeros_like(t)
    t2[delay_samples:] = t[:-delay_samples]
    strike2_thud = np.zeros_like(t)
    strike2_active = (np.random.uniform(-1, 1, len(t) - delay_samples) * np.exp(-t2[delay_samples:] / 0.004) +
                      1.2 * np.sin(2 * np.pi * 640 * t2[delay_samples:]) * np.exp(-t2[delay_samples:] / 0.055) +
                      0.8 * np.sin(2 * np.pi * 980 * t2[delay_samples:]) * np.exp(-t2[delay_samples:] / 0.040) +
                      0.4 * np.sin(2 * np.pi * 180 * t2[delay_samples:]) * np.exp(-t2[delay_samples:] / 0.045))
    strike2_thud[delay_samples:] = strike2_active
    sig = 0.6 * strike1_click + 0.85 * strike2_thud
    env = np.ones_like(t)
    fade_len = int(SR * 0.015)
    env[-fade_len:] = np.linspace(1, 0, fade_len)
    return sig * env, dur

def generate_check():
    # 130ms distinct sharper tone: bright acoustic chime / sharper harmonic resonance
    dur = 0.130
    t = np.linspace(0, dur, int(SR * dur), endpoint=False)
    # Crisp high-frequency ping transient
    transient = (np.random.uniform(-1, 1, len(t)) * np.exp(-t / 0.002) +
                 np.sin(2 * np.pi * 4200 * t) * np.exp(-t / 0.003))
    # Distinct sharper bell-wood tone (F#6 / C#7 clean acoustic chime)
    tone1 = np.sin(2 * np.pi * 1480 * t) * np.exp(-t / 0.080)
    tone2 = np.sin(2 * np.pi * 2220 * t) * np.exp(-t / 0.060)
    tone3 = np.sin(2 * np.pi * 2960 * t) * np.exp(-t / 0.040)
    sig = 0.45 * transient + 0.6 * tone1 + 0.35 * tone2 + 0.2 * tone3
    env = np.ones_like(t)
    fade_len = int(SR * 0.015)
    env[-fade_len:] = np.linspace(1, 0, fade_len)
    return sig * env, dur

def generate_castle():
    # 150ms double wood click (king then rook)
    dur = 0.150
    t = np.linspace(0, dur, int(SR * dur), endpoint=False)
    # Move 1
    click1 = (np.random.uniform(-1, 1, len(t)) * np.exp(-t / 0.003) +
              0.5 * np.sin(2 * np.pi * 880 * t) * np.exp(-t / 0.030))
    # Move 2 at 50ms
    delay_samples = int(SR * 0.050)
    t2 = np.zeros_like(t)
    t2[delay_samples:] = t[:-delay_samples]
    click2 = np.zeros_like(t)
    click2[delay_samples:] = (np.random.uniform(-1, 1, len(t) - delay_samples) * np.exp(-t2[delay_samples:] / 0.003) +
                              0.6 * np.sin(2 * np.pi * 1100 * t2[delay_samples:]) * np.exp(-t2[delay_samples:] / 0.030))
    sig = 0.6 * click1 + 0.7 * click2
    env = np.ones_like(t)
    fade_len = int(SR * 0.015)
    env[-fade_len:] = np.linspace(1, 0, fade_len)
    return sig * env, dur

def generate_promote():
    # 140ms crisp ascending two-tone sparkle
    dur = 0.140
    t = np.linspace(0, dur, int(SR * dur), endpoint=False)
    half = int(len(t) * 0.45)
    t_a = t[:half]
    t_b = t[half:] - t[half]
    tone_a = np.zeros_like(t)
    tone_b = np.zeros_like(t)
    tone_a[:half] = (np.sin(2 * np.pi * 987.77 * t_a) + 0.3 * np.sin(2 * np.pi * 1975.5 * t_a)) * np.exp(-t_a / 0.04)
    tone_b[half:] = (np.sin(2 * np.pi * 1318.5 * t_b) + 0.3 * np.sin(2 * np.pi * 2637 * t_b)) * np.exp(-t_b / 0.05)
    click = np.random.uniform(-1, 1, len(t)) * np.exp(-t / 0.002)
    sig = 0.3 * click + 0.5 * tone_a + 0.6 * tone_b
    env = np.ones_like(t)
    fade_len = int(SR * 0.015)
    env[-fade_len:] = np.linspace(1, 0, fade_len)
    return sig * env, dur

def generate_illegal():
    # 110ms damped low wood double thud
    dur = 0.110
    t = np.linspace(0, dur, int(SR * dur), endpoint=False)
    thud1 = np.sin(2 * np.pi * 180 * t) * np.exp(-t / 0.03) + 0.3 * np.random.uniform(-1, 1, len(t)) * np.exp(-t / 0.005)
    d2 = int(SR * 0.035)
    thud2 = np.zeros_like(t)
    t2 = t[:-d2]
    thud2[d2:] = np.sin(2 * np.pi * 140 * t2) * np.exp(-t2 / 0.03)
    sig = 0.7 * thud1 + 0.6 * thud2
    env = np.ones_like(t)
    fade_len = int(SR * 0.015)
    env[-fade_len:] = np.linspace(1, 0, fade_len)
    return sig * env, dur

def generate_game_start():
    # 150ms gentle welcoming wood chime chord
    dur = 0.150
    t = np.linspace(0, dur, int(SR * dur), endpoint=False)
    chord = (np.sin(2 * np.pi * 523.25 * t) * np.exp(-t / 0.08) +
             np.sin(2 * np.pi * 659.25 * t) * np.exp(-t / 0.07) +
             np.sin(2 * np.pi * 783.99 * t) * np.exp(-t / 0.06))
    click = np.random.uniform(-1, 1, len(t)) * np.exp(-t / 0.002)
    sig = 0.25 * click + 0.6 * chord
    env = np.ones_like(t)
    fade_len = int(SR * 0.015)
    env[-fade_len:] = np.linspace(1, 0, fade_len)
    return sig * env, dur

def generate_game_end():
    # 150ms resonant descending wood chord
    dur = 0.150
    t = np.linspace(0, dur, int(SR * dur), endpoint=False)
    chord = (np.sin(2 * np.pi * 783.99 * t) * np.exp(-t / 0.05) +
             np.sin(2 * np.pi * 523.25 * t) * np.exp(-t / 0.08) +
             0.5 * np.sin(2 * np.pi * 392.00 * t) * np.exp(-t / 0.09))
    click = np.random.uniform(-1, 1, len(t)) * np.exp(-t / 0.003)
    sig = 0.3 * click + 0.6 * chord
    env = np.ones_like(t)
    fade_len = int(SR * 0.015)
    env[-fade_len:] = np.linspace(1, 0, fade_len)
    return sig * env, dur

def generate_puzzle_correct():
    # 150ms crisp bright positive chime
    dur = 0.150
    t = np.linspace(0, dur, int(SR * dur), endpoint=False)
    t1 = t[:int(len(t)*0.5)]
    t2 = t[int(len(t)*0.5):] - t[int(len(t)*0.5)]
    chime1 = np.zeros_like(t)
    chime2 = np.zeros_like(t)
    chime1[:len(t1)] = np.sin(2 * np.pi * 587.33 * t1) * np.exp(-t1 / 0.04)
    chime2[len(t1):] = (np.sin(2 * np.pi * 880.00 * t2) + 0.3 * np.sin(2 * np.pi * 1760 * t2)) * np.exp(-t2 / 0.05)
    click = np.random.uniform(-1, 1, len(t)) * np.exp(-t / 0.002)
    sig = 0.2 * click + 0.5 * chime1 + 0.6 * chime2
    env = np.ones_like(t)
    fade_len = int(SR * 0.015)
    env[-fade_len:] = np.linspace(1, 0, fade_len)
    return sig * env, dur

def generate_puzzle_wrong():
    # 140ms soft descending buzz/thud
    dur = 0.140
    t = np.linspace(0, dur, int(SR * dur), endpoint=False)
    buzz = (np.sin(2 * np.pi * 220 * t) * np.exp(-t / 0.04) +
            0.5 * np.sin(2 * np.pi * 174.61 * t) * np.exp(-t / 0.05) +
            0.2 * np.random.uniform(-1, 1, len(t)) * np.exp(-t / 0.005))
    sig = buzz
    env = np.ones_like(t)
    fade_len = int(SR * 0.015)
    env[-fade_len:] = np.linspace(1, 0, fade_len)
    return sig * env, dur

GENERATORS = {
    "move": generate_move,
    "capture": generate_capture,
    "check": generate_check,
    "castle": generate_castle,
    "promote": generate_promote,
    "illegal": generate_illegal,
    "game_start": generate_game_start,
    "game_end": generate_game_end,
    "puzzle_correct": generate_puzzle_correct,
    "puzzle_wrong": generate_puzzle_wrong,
}

print(f"Generating {len(GENERATORS)} acoustic physical-modeled sound effects...")

for name, gen in GENERATORS.items():
    samples, dur = gen()
    # Normalize peak to 0.95
    peak = np.max(np.abs(samples))
    if peak > 0:
        samples = (samples / peak) * 0.95
    samples_i16 = (samples * 32767).astype(np.int16)

    raw_wav = os.path.join(TEMP_DIR, f"{name}.wav")
    wav.write(raw_wav, SR, samples_i16)

    mp3_path = os.path.join(OUT_DIR, f"{name}.mp3")
    ogg_path = os.path.join(OUT_DIR, f"{name}.ogg")

    fade_start = max(0.01, dur - 0.015)
    af_filter = f"loudnorm=I=-16:TP=-1.5:LRA=7,afade=t=out:st={fade_start:.3f}:d=0.015"

    cmd_mp3 = [
        FFMPEG, "-y", "-i", raw_wav,
        "-t", f"{dur:.3f}",
        "-af", af_filter,
        "-c:a", "libmp3lame", "-b:a", "128k",
        mp3_path
    ]
    subprocess.run(cmd_mp3, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    cmd_ogg = [
        FFMPEG, "-y", "-i", raw_wav,
        "-t", f"{dur:.3f}",
        "-af", af_filter,
        "-c:a", "libvorbis", "-q:a", "4",
        ogg_path
    ]
    subprocess.run(cmd_ogg, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    print(f"[OK] {name}: {dur*1000:.0f}ms -> MP3 ({os.path.getsize(mp3_path)} B), OGG ({os.path.getsize(ogg_path)} B)")

# Clean up temp
for f in os.listdir(TEMP_DIR):
    os.remove(os.path.join(TEMP_DIR, f))
os.rmdir(TEMP_DIR)

print("Acoustic synthesis complete!")
