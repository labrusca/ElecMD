#!/bin/sh

rm -rf ./package
asar p ./src/ ./package/app.asar
