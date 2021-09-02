# Mobile App (React Native) for Amos (Timeseries Forecasting using AWS Forecast)

This is a simple mobile app that displays charts to visualize the historical and forecast (predicted) prices of Stocks, ETFs, and Crypto assets.
The API layer is provided by serverless function running on AWS, and the underlying code is on this repo: https://github.com/afbarbaro/amos
 

## Running Storybook

From the command line in your generated app's root directory, enter `yarn run storybook`
This starts up the storybook server and opens a story navigator in your browser. With your app
running, choose Toggle Storybook from the developer menu to switch to Storybook; you can then
use the story navigator in your browser to change stories.

For Visual Studio Code users, there is a handy extension that makes it easy to load Storybook use cases into a running emulator via tapping on items in the editor sidebar. Install the `React Native Storybook` extension by `Orta`, hit `cmd + shift + P` and select "Reconnect Storybook to VSCode". Expand the STORYBOOK section in the sidebar to see all use cases for components that have `.story.tsx` files in their directories.

## Running e2e tests

Read [e2e setup instructions](./e2e/README.md).
