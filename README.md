# FlyScoop

Remote monitoring and management app for Fly.io

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Project Overview](#project-overview)
  - [Features](#features)
- [Developer Guide](#developer-guide)
  - [Initial setup](#initial-setup)
  - [Chores](#chores)
    - [Update TOC](#update-toc)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Project Overview

FlyScoop aims to be a simple, useful, on-the-go management app for Fly.io accounts.

It tries to blend the best and most essential features of the Fly.io dashboard and the `flyctl` app to make the most common monitoring and management tasks easy to accomplish.

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

## Developer Guide

### Initial setup

This is a react-native project, built using the `expo` framework.

```
npm install -g expo-cli
yarn
```

### Chores

#### Update TOC

```
yarn toc
```
