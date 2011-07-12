
default: test_server

package:
	mkdir -p pkg
	loadbuilder -d . -m js/modules -o pkg main

dist: package

test_server:
	node test/server.js

