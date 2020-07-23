#!/usr/bin/env python
import base64
from glob import glob
import subprocess
import os


def enc(r):
    key = b"key"
    l = []
    for i in range(len(r)):
        l.append(r[i] ^ key[i % 3])
    return bytearray(l)

save_file = glob("*.autosave")[0]
with open(save_file, 'rb') as f:
    r = enc(base64.b64decode(f.read()))
with open("decoded.txt", 'wb') as g:
    g.write(r)
proc = subprocess.Popen(['open','-W', 'decoded.txt'])
proc.wait()
with open("decoded.txt", 'rb') as f:
    r = f.read()
with open(save_file, 'wb') as g:
    g.write(base64.b64encode(enc(r)))
os.remove("decoded.txt")