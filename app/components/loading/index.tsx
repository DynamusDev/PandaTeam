import React, {useState} from 'react';
import LottieView from 'lottie-react-native';

import { Container, Text } from './styles';

interface Props {
  animation?: 'panda' | 'worm' | 'dot' | 'rocket' | 'rocket2',
  text?: string,
}

export function Loading(props: Props) {

  const src = 
    props.animation === 'worm' 
      ? require('./worm') : props.animation === 'panda'
        ? require('./panda') : props.animation === 'dot'
          ? require('./dot') : props.animation === 'rocket' 
            ? require('./rocket') : props.animation === 'rocket2'
              ? require('./rocket2') : require('./panda')

  return (
    <Container>
      <Text>
        {props.text || 'loading'}
      </Text>
      <LottieView 
        source={src} 
        autoPlay 
        loop
        resizeMode='contain'
        autoSize
        style={{
          height: 380,
        }}
      />
    </Container>
  );
}