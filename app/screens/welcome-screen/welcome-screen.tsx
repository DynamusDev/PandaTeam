/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react-native/no-color-literals */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import AsyncStorage from "@react-native-community/async-storage"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import React, { FunctionComponent as Component, useEffect, useState } from "react"
import { 
        Alert, 
        SafeAreaView, 
        TextInput, 
        TextStyle, 
        TouchableOpacity, 
        View, 
        ViewStyle, 
        Modal, 
        KeyboardAvoidingView, 
        Platform,
        ActivityIndicator
      } from "react-native"
import Spinner from 'react-native-loading-spinner-overlay'
import { CommonButton, Icon, Screen, Text, HeaderButton } from "../../components"
import { api } from '../../services/api'
import { color, spacing } from "../../theme"
import { useAuth } from '../../hooks/auth'
console.disableYellowBox = true

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.palette.cyan,
  paddingHorizontal: spacing[4],
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  margin: 0,
}
const INPUT: TextStyle = {
  height: 45,
  width: 280,
  borderRadius: 8,
  textAlign: 'center',
  fontSize: 22,
  marginTop: 12,
  backgroundColor: '#E2E2E0'
}
const PASSWORD: TextStyle = {
  height: 45,
  width: '80%',
  borderRadius: 8,
  textAlign: 'center',
  fontSize: 22,
}
const PASS: ViewStyle = {
  width: 280,
  height: 45,
  flexDirection: 'row',
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 12,
  backgroundColor: '#E2E2E0'
}
const SEPARATE: ViewStyle = {
  width: 32,
  height: 45,
  alignItems: 'flex-start',
  justifyContent: 'center'
}
const FOOTER: ViewStyle = { backgroundColor: color.palette.cyan, height: 70 }
const FOOTER_CONTENT: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-around',
  padding: 5,
}
const CIRCLE: ViewStyle = {
  height: 60,
  width: 60,
  borderRadius: 50,
  backgroundColor: '#58595B',
  alignItems: 'center',
  justifyContent: 'center',
}
const QUESTION: TextStyle = {
  color: '#FFF',
  fontSize: 25,
}
const CREDITOS: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
}
const POWERED: TextStyle = {
  fontSize: 12,
  color: '#fff',
  marginRight: 5,
}

const ALERTCENTERED: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  marginTop: 22
}
const ALERTTEXT: TextStyle = {
  marginBottom: 15,
  textAlign: "center",
  fontWeight: '600',
  fontSize: 20,
  color: color.palette.lightGrey
}
const ALERTVIEW: ViewStyle = {
  margin: 20,
  backgroundColor: color.palette.white,
  borderRadius: 20,
  width: '90%',
  height: 'auto',
  borderWidth: 1,
  borderColor: color.palette.lightGrey,
  padding: 20,
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5
}
const HEADERMODAL: ViewStyle = {
  height: '10%',
  width: '100%',
  alignItems: 'flex-end',
  justifyContent: 'center',
  marginBottom: 20
}

export const WelcomeScreen: Component = observer(function WelcomeScreen() {
  const [email, setEmail] = useState('')
  const [emailP, setEmailP] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(true)
  const [icon, setIcon] = useState('eyeoff')
  const [spinner, setSpinner] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [message, setMessage] = useState('')
  const navigation = useNavigation()
  const nextScreen = () => navigation.navigate("demo")

  const { signIn } = useAuth()

  useEffect(() => {
    navigate()
  }, [])

  async function navigate() {
    try {
      const user = await AsyncStorage.getItem('user')
      if (user != null) {
        navigation.navigate("drawer")
      }
    } catch (error) {
      // Error retrieving data
    }
  }

  async function forgotPassword() {
    setSpinner(true)
    try {
      const response = await api.post('forgot_password', {
        email: emailP
      })

      if (response.data.status === 400) {
        Alert.alert('Erro ao enviar!!!', response.data.error)
        setSpinner(false)
      } else if (response.data.status === 200) {
        Alert.alert('Sucesso!!!', response.data.message)
        setSpinner(false)
      }
      setEmailP('')
      setSpinner(false)
      setModalVisible(false)
    } catch(err) {
      console.log(err)
      Alert.alert('Erro ao enviar!!!', 'Tente novamente')
      setSpinner(false)
    }
  }

  async function handleSubmit() {
    try {
      setSpinner(true)
      const response = await api.post('login', {
        email,
        password,
      })
      if (response.data.status === 200) {
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user))
        navigation.navigate("drawer")
        setSpinner(false)
      } else if (response.data.status === 400) {
        setSpinner(false)
        Alert.alert('Erro ao logar!!!', response.data.error)
      } else if (response.data.status === 401) {
        setSpinner(false)
        Alert.alert('Erro ao logar!!!', response.data.error)
      }
    } catch (err) {
      console.log(err)
      Alert.alert('Erro ao logar!!!', 'Tente novamente')
      setSpinner(false)
    }
  }

  function changeIcon() {
    setShowPassword(!showPassword)
    setIcon(icon === 'eye' ? 'eyeoff' : 'eye')
  }

  return (
    <View style={FULL}>
      <Screen style={CONTAINER} statusBar='light-content' barBackground={color.palette.cyan} preset="scroll" backgroundColor={color.palette.cyan}>
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType={"fade"}
          onRequestClose={ () => { setModalVisible(false) } } >
          <View style={ALERTCENTERED}>
              <KeyboardAvoidingView 
                style={ALERTVIEW}
                enabled
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              >
                <View style={HEADERMODAL}>
                  <HeaderButton name='close' onPress={() => { setModalVisible(false) }} />
                </View>
                  <Text style={ALERTTEXT}>Informe seu email</Text>
                  <TextInput
                    style={{ ...INPUT, width: '100%' }}
                    autoCompleteType='email'
                    keyboardType='email-address'
                    multiline={false}
                    autoCapitalize='none'
                    value={emailP}
                    onChangeText={setEmailP}
                    placeholder='Email'
                  />
                  <CommonButton
                    name="Enviar"
                    loading={spinner}
                    background={color.palette.Emergência}
                    onPress={() => {
                      console.log('clicou')
                      forgotPassword()
                    }}
                  >

                  </CommonButton>
              </KeyboardAvoidingView>
          </View>
        </Modal>
        <Icon name='panda' style={{ height: 100, width: 200, backgroundColor: color.transparent }}/>
        <TextInput style={INPUT} autoCompleteType='email' keyboardType='email-address' multiline={false} autoCapitalize='none' value={email} onChangeText={setEmail} placeholder='Email' />
        <View style={PASS}>
          <View style={SEPARATE} />
          <TextInput style={PASSWORD} multiline={false} autoCapitalize='none' value={password} onChangeText={setPassword} placeholder='Senha' secureTextEntry={showPassword} />
          <TouchableOpacity style={SEPARATE} onPress={changeIcon}>
            <Icon name={icon} style={{ height: 24, width: 24 }}/>
          </TouchableOpacity>
        </View>
        <CommonButton name="Login" loading={spinner} onPress={handleSubmit} background={color.palette.green} preset="primary" />
        <CommonButton name="Esqueci minha senha" style={{ width: 'auto', marginTop: 0 }} textStyle={{ color: '#fff', textDecorationLine: 'underline' }} onPress={() => { setModalVisible(true) }} background={color.transparent} preset="primary" />
      </Screen>
      <SafeAreaView style={FOOTER}>
        <View style={FOOTER_CONTENT}>
          <View style={CREDITOS}>
            <Text style={POWERED}>
              Powered by Ekta
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  )
})
