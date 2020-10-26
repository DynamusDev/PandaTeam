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
  height: 200,
  borderRadius: 8,
  padding: 10,
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

export const ContactUs = observer(function ContactUs() {
  const navigation = useNavigation()
  const goBack = () => navigation.goBack()
  const [suggestion, setSugestion] = useState('')
  const [spinner, setSpinner] = useState(false)
  const [user, setUser] = useState([])
  const hoje = new Date()
  const isDrawerOpen = useIsDrawerOpen()

  async function handleSubmit() {
    if (suggestion === '') {
      Alert.alert('Erro ao registrar!', 'Por favor, informe o nome do membro para continuarmos com o registro')
    } else {
      try {
        setSpinner(true)
        const response = await api.post('contact_us', {
          suggestion,
          user_id: user.id
        })
        if (response.data.status === 200) {
          Alert.alert('Sucesso!!!', response.data.message)
          setSugestion('')
          setSpinner(false)
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
      <Screen style={CONTAINER} preset="scroll" statusBar='light-content' barBackground={isDrawerOpen ? (color.palette.green) : color.palette.cyan} backgroundColor={color.palette.cyan}>
        <Header
          headerText='Sugestões e Melhorias'
          style={HEADER}
          titleStyle={HEADER_TITLE}
          rightIcon='menu'
          onRightPress={() => { navigation.openDrawer() }}
        />
        <View style={CONTENT}>
          <Icon name='newPanda' style={{ height: 100, width: 200, backgroundColor: color.transparent }}/>
          <Text style={{ color: '#fff', marginVertical: 10, textAlign: 'center', fontSize: 18 }}>Digite abaixo sugestões para melhorias e até mesmo críticas para o nosso sistema!</Text>
          <TextInput style={INPUT} keyboardType='default' multiline={true} autoCapitalize='none' value={suggestion} onChangeText={setSugestion} placeholder='' />
          
          <CommonButton name="Enviar Sugestão" style={{ width: '50%' }} onPress={handleSubmit} background={color.palette.cyan} preset="primary" />
        </View>
      </Screen>
    </View>
  )
})
