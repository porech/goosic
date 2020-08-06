# All
all: frontend backend

frontend:
	cd greygoosic && npm install && npm run build

backend: packr build-linux build-windows build-darwin packr-clean

# Backend build commands
build-linux-i386:
	GOOS=linux GOARCH=386 ./build-scripts/build.sh
build-linux-amd64:
	GOOS=linux GOARCH=amd64 ./build-scripts/build.sh
build-linux-arm:
	GOOS=linux GOARCH=arm ./build-scripts/build.sh
build-windows-i386:
	GOOS=windows GOARCH=386 ./build-scripts/build.sh
build-windows-amd64:
	GOOS=windows GOARCH=amd64 ./build-scripts/build.sh
build-darwin-i386:
	GOOS=darwin GOARCH=386 ./build-scripts/build.sh
build-darwin-amd64:
	GOOS=darwin GOARCH=amd64 ./build-scripts/build.sh

build-linux: build-linux-i386 build-linux-amd64 build-linux-arm
build-windows: build-windows-i386 build-windows-amd64
build-darwin: build-darwin-i386 build-darwin-amd64

# Packr
packr:
	cd backend/pkg/server && packr2 && cp server-packr.go.fix server-packr.go
packr-clean:
	cd backend/pkg/server && packr2 clean

# Pacrk then build
linux-i386: packr build-linux-i386 packr-clean
linux-amd64: packr build-linux-amd64 packr-clean
linux-arm: packr build-linux-arm packr-clean
windows-i386: packr build-windows-i386 packr-clean
windows-amd64: packr build-windows-amd64 packr-clean
darwin-i386: packr build-darwin-i386 packr-clean
darwin-amd64: packr build-darwin-amd64 packr-clean
linux: packr build-linux packr-clean
windows: packr build-windows packr-clean
darwin: packr build-darwin packr-clean
