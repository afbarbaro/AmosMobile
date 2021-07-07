type Env = {
  API_URL: string
}

export default (__DEV__ ? require("./env.dev").default : require("./env.prod").default) as Env
