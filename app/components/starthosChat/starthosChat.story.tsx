import { storiesOf } from "@storybook/react-native"
import * as React from "react"
import { Story, StoryScreen, UseCase } from "../../../storybook/views"
import { StarthosChat } from "./starthosChat"

declare let module

storiesOf("Chat", module)
  .addDecorator(fn => <StoryScreen>{fn()}</StoryScreen>)
  .add("Starthos Chat", () => (
    <Story>
      <UseCase text="Chat" usage="The primary button." style={{flex: 1, height: 500}}>
        <StarthosChat />
      </UseCase>
    </Story>
  ))