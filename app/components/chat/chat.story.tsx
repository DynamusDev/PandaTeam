/* eslint-disable react-native/no-inline-styles */
import { storiesOf } from "@storybook/react-native"
import * as React from "react"
import { Story, StoryScreen, UseCase } from "../../../storybook/views"
import { Chat } from './chat'
declare let module

storiesOf("Chat", module)
  .addDecorator(fn => <StoryScreen>{fn()}</StoryScreen>)
  .add("Chat", () => (
    <Story>
      <UseCase text="Chat" usage="The primary chat." style={{ height: 'auto' }}>
        <Chat position='flex-start' showUser={true} msgbkgcolor='#0056A7'/>
      </UseCase>
    </Story>
  ))
