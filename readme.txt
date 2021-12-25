mkdir subprojects
cd subprojects
git clone https://github.com/nlohmann/json.git

cd ..
meson build
ninja -C build install
