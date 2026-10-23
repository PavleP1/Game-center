import math, os
from PIL import Image, ImageDraw

os.makedirs('assets', exist_ok=True)
S = 1024

bg = Image.new('RGB', (S, S))
px = bg.load()
for y in range(S):
    for x in range(S):
        t = (x + y) / (2 * S)
        px[x, y] = (int(124 * (1 - t)), int(92 * (1 - t) + 224 * t), int(255 * (1 - t) + 198 * t))

fg = Image.new('RGBA', (S, S), (0, 0, 0, 0))
d = ImageDraw.Draw(fg)
c, r = S / 2, 300
d.polygon([(c + r * math.cos(math.radians(60 * i - 30)), c + r * math.sin(math.radians(60 * i - 30))) for i in range(6)], fill=(11, 16, 32, 255))
w, l, rr, t, b = 60, c - 120, c + 120, c - 150, c + 150
d.polygon([(l, b), (l, t), (l + w, t), (rr - w, b - 100), (rr - w, t), (rr, t), (rr, b), (rr - w, b), (l + w, t + 100), (l + w, b)], fill=(255, 255, 255, 255))

bg.save('assets/icon-background.png')
fg.save('assets/icon-foreground.png')
Image.alpha_composite(bg.convert('RGBA'), fg).save('assets/icon-only.png')
