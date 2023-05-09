# Loomies

![CD Status Badge](https://github.com/PedroChaparro/loomies-mobile/actions/workflows/deployment.yml/badge.svg?branch=main)
![CI Status Badge](https://github.com/PedroChaparro/loomies-mobile/actions/workflows/integration.yml/badge.svg)

## Development environment

The project was tested to work with the following specs:

| Tool                          | Version                    |
| ----------------------------- | -------------------------- |
| Java JDK                      | openjdk 11.0.17 2022-10-18 |
| Android SDK (SDK Manager)     | Android 10.0 (Q) API 29    |
| System Image (Virtual Device) | Android 11.0 (R) API 30    |
| Yarn                          | 1.22.19                    |

## Scripts

| Command                       | Description                                          |
| ----------------------------- | ---------------------------------------------------- |
| `yarn start`                  | Starts the react-native server.                      |
| `yarn start:cache`            | Starts the react-native server clearing the cache.   |
| `yarn android`                | Runs the app on an Android device.                   |
| `yarn link:assets`            | Links the assets to the project.                     |
| `python versioning.py vx.x.x` | Updates the version of the app to prepare a release. |

### Notes

- It's recommended to use _Yarn_ instead of _NPM_ or _PNPM_ to install the node
  packages because that's the package manager used at the moment of creating a
  new deploy (See `/.github/workflows/deployment.yml` file).

- If you change the `.env` file, restart the react-native server using the
  `yarn start:cache` command instead of the `yarn start` one, that will clear
  the `.env` file cache, otherwise, your changes will not take effect.

- Before running make sure to link the assets with `yarn assets:link`.
