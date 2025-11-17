# TODO
This notes the state of things for this package after the rush of development on Nov 15 and 16, 2025.

- We discovered the Walde SDK does not run in the browser because of multiple non-browser-compatible
dependencie. We switched from http to fetch API in Walde
- Walde Client was temporarily moved to extend the BaseHttpClient. This is incorrect, it must
use composition, hence this is a priority to refactor
- The Admin API is unlikely to be supported in the browser. This is something we'll need to address
in the future