type Env = {
  API_URL: string
}

export default (__DEV__ ? require("./env.dev") : require("./env.prod")) as Env
