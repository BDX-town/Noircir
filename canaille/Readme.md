# Canaille

## Overview

Canaille is a design system created by Bdx.town for building our user interfaces. The system is composed of three libraries that work together to provide a seamless experience for developers and designers.

The first library is a SASS library that provides a comprehensive set of utility CSS classes. These classes can be used to quickly and easily style any element on a page. The classes are designed to be modular, so developers can mix and match them as needed to achieve their desired look and feel.

The second library is a React library that provides a collection of reusable UI components. These components are built using the design tokens from the SASS library, making it easy to create consistent and visually appealing interfaces. The React library includes everything from basic layout components to more complex interactive components like modals and dropdown menus.

The third library is a SVG library that exports a JavaScript bundle for icons. These icons can be easily included in any project that uses Canaille, and are designed to be flexible and scalable to fit any design.

Canaille (v3+) uses CSS layers to avoid messing with user's code. Utilities classes will take over components style, and other css code will win everything.

## Live preview

You can go there to see Canaille at it current state: [https://cl0v1s.github.io/Canaille](https://cl0v1s.github.io/Canaille)

The current mockup can be found [here](https://www.figma.com/file/m8dLKnCxYvKt8WPxsSjIMH/Mangane?type=design&node-id=1-3&mode=design&t=GauHRHjwvP13vDM0-0)

## Technical stack

- node
- javascript
- typescript
- sass

## Requirements

- Node version 20+
- Yarn

## Code style

Please check `.eslintrc` file

## Third-party libraries

Please check `package.json` for a comprehensive list of canaille dependencies.

`react` and `react-dom`, `react-router-dom` are exposed as externals of this project. Projects using Canaille must provide compatible versions.

## Getting started

1. `yarn`
2. `yarn laddle`

### Build project

1. `yarn`
2. `yarn build-prod`
