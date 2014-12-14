#!/bin/bash

version=$1

echo "Zipping up shark-bait-$version..." 

zip -r releases/shark-bait-"$version".zip -X src

echo "Done!"