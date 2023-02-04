# Loomies

![CD Status Badge](https://github.com/PedroChaparro/loomies-mobile/actions/workflows/deployment.yml/badge.svg?branch=main)
![CI Status Badge](https://github.com/PedroChaparro/loomies-mobile/actions/workflows/integration.yml/badge.svg)

## Development environment

The project was tested to work with the following specs:

| Tool                          | Version                 |
| ----------------------------- | ----------------------- |
| Java JDK                      | 19.0.2 2023-01-17       |
| Android SDK (SDK Manager)     | Android 10.0 (Q) API 29 |
| System Image (Virtual Device) | Android 11.0 (R) API 30 |
| Yarn                          | 1.22.19                 |

It's recommended to use _Yarn_ instead of _NPM_ or _PNPM_ to install the node
packages because that's the package manager used at the moment of crete a new
deploy (See `/.github/workflows/deployment.yml` file).
