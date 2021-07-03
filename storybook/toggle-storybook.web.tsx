import React, { useState, useEffect, FC } from "react"
import * as QueryString from "query-string"

interface StorybookQueryParams {
  storybook?: boolean
}

export const ToggleStorybook: FC = (props) => {
  const [StorybookUIRoot, setStorybookUIRoot] = useState<any>(null)
  const [queryParams, setQueryParams] = useState<StorybookQueryParams>({})

  useEffect(() => {
    if (__DEV__) {
      // Load the storybook UI once
      setStorybookUIRoot(() => require("./storybook").StorybookUIRoot)
    }
  }, [])

  useEffect(() => {
    if (__DEV__) {
      setQueryParams(QueryString.parse(window.location.search))
    }
  }, [window.location.search])

  if (queryParams?.storybook) {
    return StorybookUIRoot ? <StorybookUIRoot /> : null
  } else {
    return <>{props.children}</>
  }
}
