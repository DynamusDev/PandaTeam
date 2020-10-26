/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-sequences */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-native/no-color-literals */
import React, { useEffect, useState, useMemo } from "react"
import { Image, ImageStyle, Platform, TextStyle, View, ViewStyle, AsyncStorage, Alert, TouchableOpacity, Modal } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { BulletItem, Button, Header, Text, Screen, Wallpaper, HeaderButton, CommonButton } from "../../components"
import { color, spacing } from "../../theme"
import socketio from 'socket.io-client'
import Feather from '@expo/vector-icons/Feather'
import { api, sock } from "../../services/api"
import { save } from "../../utils/storage"
import { useIsDrawerOpen } from '@react-navigation/drawer'
import { FlatList, ScrollView, TextInput } from "react-native-gesture-handler"
import DateTimePicker from "react-native-modal-datetime-picker"
import * as ImagePicker from 'expo-image-picker'
import Constants from 'expo-constants'
import Permissions from 'expo-permissions'
import Spinner from 'react-native-loading-spinner-overlay'

const FULL: ViewStyle = { flex: 1, backgroundColor: '#fff', }
const CONTAINER: ViewStyle = {
  flex: 1,
}
const CONTENT: ViewStyle = {
  flex: 1,
  backgroundColor: '#fff'
}
const BOLD: TextStyle = { fontWeight: "bold" }
const HEADER: TextStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[3],
  paddingHorizontal: spacing[3],
  backgroundColor: color.palette.cyan
}
const HEADER_TITLE: TextStyle = {
  fontSize: 20,
  textAlign: "center",
  letterSpacing: 1.5,
}

const EVENTCONTAINER: ViewStyle = {
  width: '90%',
  height: 90,
  borderRadius: 12,
  alignItems: 'center',
  justifyContent: 'space-around',
  flexDirection: 'row',
  marginTop: 10,
  marginHorizontal: 10,
  backgroundColor: 'rgba(0, 0, 0, 0.2)'
}

const INFOS: ViewStyle = {
  height: 50,
  alignItems: 'center',
  justifyContent: 'center',
}

const ALERTCENTEREDT: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  marginTop: 22
}
const ALERTTEXTT: TextStyle = {
  marginBottom: 15,
  textAlign: "center",
  fontWeight: '600',
  fontSize: 20,
  color: color.palette.lightGrey
}
const ALERTVIEWT: ViewStyle = {
  margin: 20,
  backgroundColor: color.palette.blue,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: color.palette.lightGrey,
  paddingVertical: 18,
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
  height: '70%',
  width: '90%',
}

const INPUT: TextStyle = {
  height: 45,
  width: 280,
  borderRadius: 8,
  textAlign: 'center',
  fontSize: 22,
  marginTop: 12,
  color: '#333',
  backgroundColor: color.palette.green
}
const ALERTTEXT: TextStyle = {
  textAlignVertical: 'center',
  width: '100%',
  textAlign: "center",
  fontWeight: '500',
  fontSize: 22,
  color: color.palette.white
}
const HEADERMODAL: ViewStyle = {
  width: '100%',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  height: 60,
  paddingHorizontal: 7
}
const SEPARATE: ViewStyle = {
  width: 32,
  height: 10
}

const IMAGE: ViewStyle = {
  height: '75%',
  width: '85%',
  backgroundColor: color.transparent,
  borderRadius: 15,
  borderColor: color.palette.lightGrey,
  justifyContent: 'center',
  alignItems: "center",
  // elevation: 5
}

const FABICON: TextStyle = {
  fontSize: 40,
  color: 'white',
  height: '100%',
  textAlignVertical: 'center'
}

const FAB: ViewStyle = {
  position: 'absolute',
  width: 56,
  height: 56,
  alignItems: 'center',
  justifyContent: 'center',
  right: 20,
  bottom: 20,
  backgroundColor: color.palette.cyan,
  borderRadius: 30,
  elevation: 8
}

export const DemoScreen = observer(function DemoScreen() {
  const navigation = useNavigation()
  const goBack = () => navigation.goBack()
  const [content, setContent] = useState('infos')
  const [user, setUser] = useState([])
  const [name, setName] = useState([])
  const [items, setItems] = useState([])
  const [events, setEvents] = useState([])
  const [event, setEvent] = useState([])
  const [image, setImage] = useState('')
  const [title, setTitle] = useState('')
  const [date, setDate] = useState((new Date().getDate() < 10 ? '0' : '') + new Date().getDate().toString() + '/' + (new Date().getMonth() + 1).toString() + '/' + new Date().getFullYear().toString())
  const [amount_spent, setAmount_spent] = useState('')
  const [user_id, setUser_id] = useState(null)
  const [tax_coupon_one, setTax_coupon_one] = useState('')
  const [tax_coupon_two, setTax_coupon_two] = useState('')
  const [tax_coupon_three, setTax_coupon_three] = useState('')
  const [tax_coupon_four, setTax_coupon_four] = useState('')
  const [tax_coupon_five, setTax_coupon_five] = useState('')
  const [cash, setCash] = useState('')
  const [showAlert, setShowAlert] = useState(false)
  const [newEvent, setNewEvent] = useState(false)
  const isDrawerOpen = useIsDrawerOpen()
  const [datePiker, setDatePicker] = useState(false)
  const [loading, setLoading] = useState(false)
  const socket = useMemo(() => socketio(sock), [])

  useEffect(() => {
    socket.on('cash', data =>
      setCash(data)
    )
    socket.on('event', data =>{
      console.log(data)
      events.push(data)
    })
  }, [events])

  async function loadEvents() {
    const response = await api.get('event')
    setEvents(response.data.events)

    const cash = await api.get('cash')
    setCash(cash.data.cash.amount)
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      //aspect: [16, 24],
      quality: 1,
      base64: true
    })

    console.log(result)

    if (!result.cancelled) {
      setTax_coupon_one(result.base64)
    }
  }
  
  const takePhoto = async () => {
    ImagePicker.getCameraPermissionsAsync()
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      //aspect: [16, 24],
      quality: 1,
      base64: true
    })

    console.log(result)

    if (!result.cancelled) {
      setTax_coupon_one(result.base64)
    }
  }

  function handleDatePicked(date) {
    const month = date.toString().split(' ')[1] === 'Jan' ? ('01')
      : date.toString().split(' ')[1] === 'Feb' ? ('02')
        : date.toString().split(' ')[1] === 'Mar' ? ('03')
          : date.toString().split(' ')[1] === 'Apr' ? ('04')
            : date.toString().split(' ')[1] === 'May' ? ('05')
              : date.toString().split(' ')[1] === 'Jun' ? ('06')
                : date.toString().split(' ')[1] === 'Jul' ? ('07')
                  : date.toString().split(' ')[1] === 'Aug' ? ('08')
                    : date.toString().split(' ')[1] === 'Sep' ? ('09')
                      : date.toString().split(' ')[1] === 'Oct' ? ('10')
                        : date.toString().split(' ')[1] === 'Nov' ? ('11')
                          : date.toString().split(' ')[1] === 'Dec' && '12'
    const dateT = date.toString().split(' ')[2] + '/' + month + '/' + date.toString().split(' ')[3]
    setDate(dateT)
    setDatePicker(false)
  };

  async function handleSubmit() {
    if (title == '') {
      Alert.alert('Erro ao registrar', 'Por favor, informe o título deste evento')
    } else if (amount_spent == '') {
      Alert.alert('Erro ao registrar', 'Por favor, informe o valor gasto para este evento')
    }else {
      setNewEvent(false)
      setLoading(true)
      const data = {
        title,
        amount_spent,
        date,
        tax_coupon_one,
        tax_coupon_two,
        tax_coupon_three,
        tax_coupon_four,
        tax_coupon_five,
        user_id: user.id
      }

      try {
        const response = await api.post('event', data)
        console.log(response.data.message),
        
        setLoading(false)
        setNewEvent(false)
        Alert.alert('Sucesso!!!', response.data.message)
        setTitle(''),
        setAmount_spent(''),
        setTax_coupon_one(''),
        setTax_coupon_two(''),
        setTax_coupon_three(''),
        setTax_coupon_four(''),
        setTax_coupon_five('')
      }catch(err){
        setLoading(false)
        console.log(err)
        Alert.alert('Erro ao registrar', 'Por favor, tente novamente')
      }
    }
  }

  useEffect(() => {
    async function retrieveData() {
      setLoading(true)
      const response = await api.get('event')
      setEvents(response.data.events)
      const cash = await api.get('cash')
      console.log(cash.data)
      setCash(cash.data.cash.amount)
      setLoading(false)
      const myArray = await AsyncStorage.getItem('user')
      if (myArray !== null) {
        // We have data!!
        const usuário = JSON.parse(myArray)
        setUser(usuário)
        setName(usuário.name.split(" ")[0])
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
        visible={loading}
        textContent={'Loading...'}
        animation={'slide'}
        textStyle={{ color: '#FFF' }}
        overlayColor={'rgba(0,0,0,0.80)'}
      />
      <Modal
        visible={newEvent}
        transparent={true}
        animationType={"fade"}
        onRequestClose={ () => { setNewEvent(false) } } >
        <View style={ALERTCENTEREDT}>
          <View style={{ ...ALERTVIEWT, height: '70%' }}>
            <View style={HEADERMODAL}>
              <Text style={ALERTTEXT}> Adicionar evento </Text>
              <HeaderButton style={{position: 'absolute', top: 0, right: 8}} name='close' onPress={() => { setNewEvent(false) }} />
            </View>
            <TextInput style={INPUT} keyboardAppearance='dark' placeholderTextColor={color.palette.cyan} multiline={false} autoCapitalize='words' value={title} onChangeText={setTitle} placeholder='Título do Evento' />
            <TextInput style={{ ...INPUT, textAlign: 'center' }}
              placeholderTextColor={color.palette.cyan}
              keyboardType='decimal-pad'
              keyboardAppearance='dark'
              returnKeyType='done'
              multiline={false}
              autoCapitalize='none'
              value={amount_spent}
              onChangeText={setAmount_spent}
              placeholder='Valor Utilizado'
            />
            <CommonButton name={date} style={{ width: '83%' }} textStyle={{ fontSize: 22, color: color.palette.cyan }} onPress={() => { setDatePicker(true) }} background={color.palette.green} preset="primary" />
            <DateTimePicker
              isVisible={datePiker}
              onConfirm={handleDatePicked}
              onCancel={() => { setDatePicker(false) }}
            />
            <View style={{flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'center'}}>
              <View style={{
                width: 100, 
                height: 100, 
                alignItems: 'center', 
                justifyContent: 'center',
                borderRadius: 8,
                borderWidth: 0.3,
                borderColor: color.palette.offWhite,
                }}
              >
                {tax_coupon_one ? 
                  <Image
                  style={{ width: 100, height: 100 }}
                  source={ { uri: `data:image/gif;base64,${tax_coupon_one}` } }
                  resizeMode='contain' />
                  :
                  <Text style={{width: 80, fontSize: 10, textAlign: 'center'}}> Selecione uma imagem ou tire uma foto da nota </Text>
                }
              </View>
              <View style={{height: 90, justifyContent: 'space-around', marginLeft: 10}}>
                <Feather name='camera' onPress={takePhoto} size={32} color={color.palette.offWhite} />
                <Feather name='paperclip' onPress={pickImage} size={32} color={color.palette.offWhite} />
              </View>
            </View>
            <CommonButton name='Salvar Evento' style={{ width: '50%' }} textStyle={{ fontSize: 22 }} onPress={handleSubmit} background={color.palette.cyan} preset="primary" />
          </View>
        </View>
      </Modal>
      <Modal
        visible={showAlert}
        transparent={true}
        animationType={"fade"}
        onRequestClose={ () => { setShowAlert(false) } } >
        <View style={ALERTCENTEREDT}>
          {content === 'image' ? (
            <TouchableOpacity activeOpacity={5} onPress={() => { setContent('infos') }}style={{ ...ALERTCENTEREDT, backgroundColor: 'rgba(0,0,0,0.0)', width: '90%' }}>
              <Image
                style={{ width: '100%', height: '90%', borderRadius: 15 }}
                source={{ uri: `data:image/gif;base64,${image}` }}
                resizeMode='contain' />
            </TouchableOpacity>
          )
            : <View style={ALERTVIEWT}>
              <View style={HEADERMODAL}>
                <HeaderButton  name='close' onPress={() => { setShowAlert(false) }} />
                <Text style={ALERTTEXT}> {event.title} </Text>
              </View>

              <Text style={{ fontWeight: '400', fontSize: 20, color: color.palette.offWhite, marginTop: 15 }}>Data do evento</Text>
              <Text style={{ fontWeight: '400', fontSize: 20, color: color.palette.offWhite }}>{event.date}</Text>

              <Text style={{ fontWeight: '400', fontSize: 20, color: color.palette.offWhite, marginTop: 15 }}>Valor Utilizado</Text>
              <Text style={{ fontWeight: '400', fontSize: 20, color: color.palette.offWhite }}>{ event.amount_spent }
              </Text>
              <Text style={{ fontWeight: '400', marginBottom: 12, fontSize: 20, color: color.palette.offWhite, marginTop: 15 }} preset="fieldLabelTitle" text="Anexos" />
              <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }} style={{ width: '100%', height: 'auto' }}>
                <View style={{ width: '100%', height: 120, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <TouchableOpacity
                    onPress={() => { setContent('image'); setImage(event.tax_coupon_one) } }
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
                      source={{ uri: `data:image/gif;base64,${event.tax_coupon_one}`}}
                      resizeMode='contain' />
                  </TouchableOpacity>
                  {event.tax_coupon_two !== '' ? (
                    <TouchableOpacity
                      onPress={() => { setContent('image'), setImage(event.tax_coupon_two) } }
                      style={{
                        height: 'auto',
                        alignItems: 'center',
                        width: '33%',
                        marginBottom: 8,
                        padding: 1,
                        borderRadius: 8,
                        borderWidth: 0.3,
                        borderColor: color.palette.offWhite,
                      }}>

                      <Image
                        style={{ width: '100%', height: 100, borderRadius: 15 }}
                        source={{ uri: `data:image/gif;base64,${event.tax_coupon_two}` }}
                        resizeMode='contain' />
                    </TouchableOpacity>
                  ) : null
                  }
                </View>
                {event.tax_coupon_three !== '' ? (
                  <View style={{ width: '100%', height: 120, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity
                      onPress={() => { setContent('image'); setImage(event.tax_coupon_three) } }
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
                        source={{ uri: `data:image/gif;base64,${event.tax_coupon_three}` }}
                        resizeMode='contain' />
                    </TouchableOpacity>
                    {event.tax_coupon_four !== '' ? (
                      <TouchableOpacity
                        onPress={() => { setContent('image'), setImage(event.tax_coupon_four) } }
                        style={{
                          height: 'auto',
                          alignItems: 'center',
                          width: '33%',
                          marginBottom: 8,
                          padding: 1,
                          borderRadius: 8,
                          borderWidth: 0.3,
                          borderColor: color.palette.offWhite,
                        }}>

                        <Image
                          style={{ width: '100%', height: 100, borderRadius: 15 }}
                          source={{ uri: `data:image/gif;base64,${event.tax_coupon_four}` }}
                          resizeMode='contain' />
                      </TouchableOpacity>
                    ) : null
                    }
                  </View>
                ) : null}
              </ScrollView>
            </View>
          }
        </View>
      </Modal>
      <Screen style={CONTAINER} preset="fixed" statusBar='light-content' barBackground={isDrawerOpen ? (color.palette.green) : color.palette.cyan} backgroundColor={color.palette.cyan}>
        <Header
          headerText={`Olá, ${name}`}
          style={HEADER}
          titleStyle={HEADER_TITLE}
          rightIcon='menu'
          onRightPress={() => { navigation.openDrawer() }}
        />
        <View style={CONTENT}>
          <Text style={{
            color: '#333',
            width: '100%',
            textAlign: 'center',
            fontSize: 20,
            marginVertical: 5
          }}
          >
            Valor em caixa <Text style={{ fontWeight: '600', color: '#333', fontSize: 20, }}>
                R$ {cash}  </Text>
          </Text>
          <Text style={{
            fontWeight: '500',
            color: color.palette.cyan,
            fontSize: 25,
            marginTop: 15,
            width: '100%',
            textAlign: 'center',
          }}>Eventos</Text>
          {events.length > 0 ?
          <FlatList
            data={ events }
            style={{
              flex: 1
            }}
            contentContainerStyle={{
              alignItems: 'center'
            }}
            showsVerticalScrollIndicator={false}
            keyExtractor={event => String(event.id)}
            onEndReached={loadEvents}
            onEndReachedThreshold={0.2}
            renderItem={({ item: event }) => (
              <TouchableOpacity
                style={EVENTCONTAINER}
                onPress={() => {
                  setEvent(event)
                  setShowAlert(true)
                  setContent('infos')
                }}
              >
                <View style={INFOS}>
                  <Text style={{ fontWeight: '300', fontSize: 35, color: color.palette.cyan }}>{event.date.split("/")[0]}</Text>
                  <Text style={{ fontWeight: '300', fontSize: 15, color: color.palette.cyan }}>{event.date.split("/")[1] + '/' + event.date.split("/")[2]}</Text>
                </View>
                <View style={INFOS}>
                  <Text style={{ color: '#333', fontWeight: '500' }}>{event.title}</Text>
                  <Text style={{ color: '#333', fontWeight: '200', fontStyle: 'italic', marginTop: 10 }}>Clique aqui para ver mais detalhes</Text>
                </View>
              </TouchableOpacity>
            )}
          />
          : 
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{ 
              textAlign: 'center', 
              width: '100%',
              fontWeight: '500', 
              color: color.palette.cyan ,
              marginBottom: 15
              }}> 
              Nenhum evento lançado ainda 
              </Text>
              <Feather name='meh' size={50} color={color.palette.cyan} />
            </View>
          }
          {user.admin === true ? (
            <TouchableOpacity onPress={() => { setNewEvent(true) }} style={FAB}>
              <Text style={FABICON}>+</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </Screen>
    </View>
  )
})
