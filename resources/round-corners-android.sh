#!/bin/bash

resourcesDir=${1:-.}

for filepath in $resourcesDir/android/icon/*.png; do
  dir=$(dirname $filepath)
  filename=$(basename $filepath)

  width=$(convert $filepath -format %w info:)
  corner=$(($width/8))

  roundedDir="${dir}/rounded"
  mkdir -p $roundedDir

  echo "Rounding corners of $filepath ($corner px)..."
  convert $filepath \
     \( +clone  -alpha extract \
        -draw "fill black polygon 0,0 0,$corner $corner,0 fill white circle $corner,$corner $corner,0" \
        \( +clone -flip \) -compose Multiply -composite \
        \( +clone -flop \) -compose Multiply -composite \
     \) -alpha off -compose CopyOpacity -composite "${roundedDir}/${filename}"
done
