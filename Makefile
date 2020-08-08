frontend:
	cd greygoosic && npm install && npm run build

# Backend build commands
build-linux-i386:
	GOOS=linux GOARCH=386 ./build-scripts/build.sh
build-linux-amd64:
	GOOS=linux GOARCH=amd64 ./build-scripts/build.sh
build-linux-arm:
	GOOS=linux GOARCH=arm ./build-scripts/build.sh
build-linux-arm64:
	GOOS=linux GOARCH=arm64 ./build-scripts/build.sh
build-windows-i386:
	GOOS=windows GOARCH=386 ./build-scripts/build.sh
build-windows-amd64:
	GOOS=windows GOARCH=amd64 ./build-scripts/build.sh
build-darwin-i386:
	GOOS=darwin GOARCH=386 ./build-scripts/build.sh
build-darwin-amd64:
	GOOS=darwin GOARCH=amd64 ./build-scripts/build.sh

build-windows-i386-docker:
	docker run -it --rm -e "GOOS=windows" -e "GOARCH=386" -e "PKG_CONFIG_PATH=/usr/i686-w64-mingw32/lib/pkgconfig" -e "CGO_ENABLED=1" -e "CXX=i686-w64-mingw32-g++" -e "CC=i686-w64-mingw32-gcc" -v $(shell pwd):/goosic -w /goosic alerinaldi/archlinux-mingw-taglib ./build-scripts/build.sh
build-windows-amd64-docker:
	docker run -it --rm -e "GOOS=windows" -e "GOARCH=amd64" -e "PKG_CONFIG_PATH=/usr/x86_64-w64-mingw32/lib/pkgconfig" -e "CGO_ENABLED=1" -e "CXX=x86_64-w64-mingw32-g++" -e "CC=x86_64-w64-mingw32-gcc" -v $(shell pwd):/goosic -w /goosic alerinaldi/archlinux-mingw-taglib ./build-scripts/build.sh

build:
	./build-scripts/build.sh

build-linux: build-linux-i386 build-linux-amd64 build-linux-arm
build-windows: build-windows-i386 build-windows-amd64
build-darwin: build-darwin-i386 build-darwin-amd64
build-windows-docker: build-windows-i386-docker build-windows-amd64-docker

# Packr
packr:
	cd backend/pkg/server && packr2 && cp server-packr.go.fix server-packr.go
packr-clean:
	cd backend/pkg/server && packr2 clean

# Pacrk then build
linux-i386: packr build-linux-i386 packr-clean
linux-amd64: packr build-linux-amd64 packr-clean
linux-arm: packr build-linux-arm packr-clean
linux-arm64: packr build-linux-arm64 packr-clean
windows-i386: packr build-windows-i386 packr-clean
windows-amd64: packr build-windows-amd64 packr-clean
darwin-i386: packr build-darwin-i386 packr-clean
darwin-amd64: packr build-darwin-amd64 packr-clean
linux: packr build-linux packr-clean
windows: packr build-windows packr-clean
darwin: packr build-darwin packr-clean

windows-docker: frontend packr build-windows-docker packr-clean

all: frontend packr build packr-clean
