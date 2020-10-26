import React, { useEffect, useState } from "react"
import { Image, ImageStyle, Platform, TextStyle, View, ViewStyle, AsyncStorage, Alert, TouchableOpacity, TextInput } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { BulletItem, Button, Header, Text, Screen, Wallpaper, Icon, CommonButton } from "../../components"
import { color, spacing } from "../../theme"
import { api } from "../../services/api"
import { save } from "../../utils/storage"
import { useIsDrawerOpen } from '@react-navigation/drawer'
import CheckBox from 'react-native-check-box'
import Spinner from 'react-native-loading-spinner-overlay'
import * as ImagePicker from 'expo-image-picker'
import Constants from 'expo-constants'

const FULL: ViewStyle = { flex: 1, backgroundColor: '#fff', }
const CONTAINER: ViewStyle = {
  flex: 1,
}
const CONTENT: ViewStyle = {
  flex: 1,
  backgroundColor: color.palette.blue,
  alignItems: 'center',
  justifyContent: 'center'
}
const BOLD: TextStyle = { fontWeight: "bold" }
const HEADER: TextStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[3],
  paddingHorizontal: spacing[3],
  backgroundColor: color.palette.cyan
}
const HEADER_TITLE: TextStyle = {
  fontSize: 18,
  textAlign: "center",
  letterSpacing: 1.5,
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

const timeToString = (time) => {
  const date = new Date(time)
  return date.toISOString().split('T')[0]
}

export const Profile = observer(function Profile() {
  const navigation = useNavigation()
  const goBack = () => navigation.goBack()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState('')
  const [pass, setPass] = useState('')
  const [spinner, setSpinner] = useState(false)
  const [user, setUser] = useState([])
  const isDrawerOpen = useIsDrawerOpen()

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true
    })

    console.log(result)

    if (!result.cancelled) {
      setAvatar(result.base64)
    }
  }

  async function handleSubmit() {
    console.log('com password')
    if (name === '') {
      Alert.alert('Erro ao registrar!', 'Por favor, informe o nome do membro para continuarmos com o registro')
    } else if (email === '') {
      Alert.alert('Erro ao registrar!', 'Por favor, informe o email do membro para continuarmos com o registro')
    } else {
        try {
          setSpinner(true)
          const response = await api.put(`users/${user.id}`, {
            name,
            email,
            avatar,
            password: pass
          })
          if (response.data.status === 200) {
            Alert.alert('Sucesso!!!', response.data.message)
            setSpinner(false)
            await AsyncStorage.setItem('user', JSON.stringify(response.data.user))
          } else if (response.data.status === 400) {
            setSpinner(false)
            Alert.alert('Erro ao registrar!!!', response.data.error)
          } else if (response.data.status === 401) {
            setSpinner(false)
            Alert.alert('Erro ao registrar!!!', response.data.error)
          }
        } catch (err) {
          console.log(err)
          Alert.alert('Erro ao registrar!!!', 'Tente novamente')
          setSpinner(false)
        }
    }
  }

  async function handleSubmitWithoutPass() {
    console.log('sem password')
    if (name === '') {
      Alert.alert('Erro ao registrar!', 'Por favor, informe o nome do membro para continuarmos com o registro')
    } else if (email === '') {
      Alert.alert('Erro ao registrar!', 'Por favor, informe o email do membro para continuarmos com o registro')
    } else {
        try {
          setSpinner(true)
          const response = await api.put(`edit/${user.id}`, {
            name,
            email,
            avatar
          })
          if (response.data.status === 200) {
            Alert.alert('Sucesso!!!', response.data.message)
            setSpinner(false)
            await AsyncStorage.setItem('user', JSON.stringify(response.data.user))
          } else if (response.data.status === 400) {
            setSpinner(false)
            Alert.alert('Erro ao registrar!!!', response.data.error)
          } else if (response.data.status === 401) {
            setSpinner(false)
            Alert.alert('Erro ao registrar!!!', response.data.error)
          }
        } catch (err) {
          console.log(err)
          Alert.alert('Erro ao registrar!!!', 'Tente novamente')
          setSpinner(false)
        }
    }
  }

  useEffect(() => {
    async function retrieveData() {
      const myArray = await AsyncStorage.getItem('user')
      if (myArray !== null) {
        // We have data!!
        const usuário = JSON.parse(myArray)
        setUser(usuário)
        setName(usuário.name)
        setEmail(usuário.email)
        setAvatar(usuário.avatar)
      }
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync()
        if (status !== 'granted') {
          Alert.alert('Sorry, we need camera roll permissions to make this work!')
        }
      }
    };
    retrieveData()
  }, [])

  return (
    <View style={FULL}>
      <Spinner
        visible={spinner}
        textContent={'Loading...'}
        animation={'slide'}
        textStyle={{ color: '#FFF' }}
        overlayColor={'rgba(0,0,0,0.80)'}
      />
      <Screen style={CONTAINER} preset="fixed" statusBar='light-content' barBackground={isDrawerOpen ? (color.palette.green) : color.palette.cyan} backgroundColor={color.palette.cyan}>
        <Header
          headerText='Editar dados pessoais'
          style={HEADER}
          titleStyle={HEADER_TITLE}
          rightIcon='menu'
          onRightPress={() => { navigation.openDrawer() }}
        />
        <View style={CONTENT}>
          <TouchableOpacity
              onPress={pickImage}
              style={{
                height: 'auto',
                alignItems: 'center',
                width: '33%',
                marginBottom: 8,
                marginRight: 10,
                padding: 1,
                borderRadius: 8,
                borderWidth: 0.3,
                borderColor: color.palette.offWhite,
              }}>

              <Image
                style={{ width: '100%', height: 100, borderRadius: 15 }}
                source={{ uri: `data:image/gif;base64,${avatar}` }}
                resizeMode='contain' />
            </TouchableOpacity>
          
          <TextInput 
            style={INPUT} 
            multiline={false} 
            autoCapitalize='words' 
            keyboardAppearance='dark' 
            value={name} 
            onChangeText={setName} 
            placeholder='Nome Completo' 
          />
          <TextInput 
            style={INPUT} 
            autoCompleteType='email' 
            keyboardType='email-address' 
            keyboardAppearance='dark' 
            multiline={false} 
            autoCapitalize='none' 
            value={email} 
            onChangeText={setEmail} 
            placeholder='Email' 
          />
          <TextInput 
            style={INPUT} 
            autoCompleteType='password' 
            keyboardType='default' 
            keyboardAppearance='dark' 
            autoCorrect={false} 
            multiline={false} 
            autoCapitalize='none' 
            value={pass} 
            onChangeText={setPass} 
            placeholder='Senha' 
          />
          <CommonButton 
            name="Editar dados" 
            style={{ width: '50%' }} 
            onPress={pass === '' ? handleSubmitWithoutPass : handleSubmit} 
            background={color.palette.cyan} 
            preset="primary" 
          />
        </View>
      </Screen>
    </View>
  )
})
