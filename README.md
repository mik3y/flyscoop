# FlyScoop

Mobile monitoring and management app for Fly.io.


![screenshot-1](https://user-images.githubusercontent.com/390829/194562517-13bb694a-8dfd-47e8-9b59-881b1c7a5f5a.png) ![screenshot-2](https://user-images.githubusercontent.com/390829/194562512-5198ac93-ed47-44f4-8034-b062e2f5e9d7.png) ![screenshot-3](https://user-images.githubusercontent.com/390829/194562516-aba626df-6d9f-4531-a02e-eda800337674.png)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Project Overview](#project-overview)
  - [Features](#features)
  - [App Store Releases](#app-store-releases)
- [Developer Guide](#developer-guide)
  - [Orientation](#orientation)
  - [Developer setup](#developer-setup)
  - [Pre-commit and lint](#pre-commit-and-lint)
  - [Chores](#chores)
    - [Update TOC](#update-toc)
    - [Releases](#releases)
  - [Contributing](#contributing)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Project Overview

FlyScoop aims to be a simple, useful, on-the-go management app for Fly.io accounts.

Rather than replicate the full functionality of the official web dashboards command-line tools, the goal is to support the _most essential_ features necessary for fast mobile monitoring and management. Think of it as a companion to the oncall engineer's desktop environment, but not a replacement.

### Features

- [x] List all of your apps
- [x] See a basic app overview
  - [x] Last deployment name and date
  - [x] Scale size
  - [x] Basic metrics
- [x] View/follow app logs
- [ ] Change app scale
- [ ] Rollback / re-deploy a previous version
- [ ] Drill down by region
  - [ ] Metrics
  - [ ] Logs
  - [ ] Instances

### App Store Releases

The app has not yet been released to the iOS & Android app stores. Links to these releases will appear here.

For access to test builds (TestFlight, etc) please visit the [Fly.io community thread](https://community.fly.io/t/flyscoop-mobile-app-for-monitoring-managing-fly-io-resources/4071).

## Developer Guide

### Orientation

This is a [React Native](https://reactnative.dev/) app, targeting iOS and Android. It additionally uses the [Expo](https://expo.dev/) framework, and Expo's [EAS](https://expo.dev/eas) build service.

The initial entrypoint into the app is [`App.tsx`](https://github.com/mik3y/flyscoop/blob/main/App.tsx). This module installs various (global) context providers and the initial view.

Code is organized into the following subdirs:

* `src/view/`: Major screens of the app's UI.
* `src/component/`: React components, used within views.
* `src/lib/`: "Everything else"; typically non-React-specific classes and utilities.

### Developer setup

To get started locally, use `yarn` to install all the package's various dependencies.

```
yarn
```

Then use `yarn ios` or `yarn android` to build and run the app. These commands will launch on either an emulator or on an attached device, depending on what's available and what options are provided.

### Pre-commit and lint

A [`pre-commit`](https://pre-commit.com/) configuration is included and, when installed in your local repo, ensures code is automatically formatted upon commit.

Use the following command to install the `pre-commit` hooks:

```
pre-commit install
```

### Chores

#### Update TOC

Keep the table of contents in this doc nicely formatted, with:

```
yarn toc
```

#### Releases

TODO. Not yet sure how to share this.

### Contributing

Contributions are very welcome, either in the form of code or ideas. Please go ahead and [open an issue on GitHub](https://github.com/mik3y/flyscoop/issues) to kick things off.

## License

All code is offered under the **MIT** license, unless otherwise noted.  Please see `LICENSE.txt` for the full license.

This project is neither endorsed nor affiliated with Fly.io, Inc.
