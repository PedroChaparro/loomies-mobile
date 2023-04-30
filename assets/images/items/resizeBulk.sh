#/usr/bin/env sh
# A little one liner to help resizing a bunch of images
ffmpeg -f image2 -i "%03d.png" -vf scale="500:500" "tmp/%03d.png"
