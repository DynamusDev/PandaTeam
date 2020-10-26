import React, { useEffect, useState, useMemo } from "react"
import { 
          TextStyle, 
          View, 
          ViewStyle, 
          AsyncStorage, 
          Alert, 
          SectionList,
          TextInput, 
          FlatList,
          Modal,
          TouchableOpacity,
          ActivityIndicator
        } from "react-native"
import { useNavigation } from "@react-navigation/native"
import socketio from 'socket.io-client'
import Feather from '@expo/vector-icons/Feather'
import { observer } from "mobx-react-lite"
import { Header, Text, Screen, CommonButton } from "../../components"
import { color, spacing } from "../../theme"
import { api, sock } from "../../services/api"
import { useIsDrawerOpen } from '@react-navigation/drawer'
import Spinner from 'react-native-loading-spinner-overlay'
import { name } from "validate.js"

const FULL: ViewStyle = { flex: 1, backgroundColor: '#fff', }
const CONTAINER: ViewStyle = {
  flex: 1,
}
const CONTENT: ViewStyle = {
  flex: 1,
  backgroundColor: color.palette.blue,
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: 25
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

const CENTEREDVIEW: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  marginTop: 22
}
const MODALVIEW: ViewStyle = {
  backgroundColor: "#FFF",
  borderRadius: 20,
  width: '75%',
  padding: 15,
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2
  },
  shadowOpacity: 0.25,
  shadowRadius: 20,
  elevation: 5,
  height: 150
}
const TYPELIST: ViewStyle = {
  flex: 1,
  maxHeight: 125,
  width: '100%',
}

const timeToString = (time: string | number | Date) => {
  const date = new Date(time)
  return date.toISOString().split('T')[0]
}

export const CashIn = observer(function CashIn() {
  const navigation = useNavigation()
  const [showUsers, setShowUsers] = useState(false)
  const [username, setUsername] = useState('Selecione o contribuinte')
  const [userId, setUserId] = useState(null)
  const [loading, setLoading] = useState(true)
  const goBack = () => navigation.goBack()
  const [amount, setAmount] = useState('')
  const [spinner, setSpinner] = useState(false)
  const [user, setUser] = useState([])
  const [users, setUsers] = useState([])
  const [entries, setEntries] = useState([])
  const hoje = new Date()
  const isDrawerOpen = useIsDrawerOpen()
  const socket = useMemo(() => socketio(sock), [])

  useEffect(() => {
    socket.on('entry', data =>{
      console.log(data)
      entries.push(data)
    })
  }, [entries])

  async function handleSubmit() {
    if (amount === '') {
      Alert.alert('Erro ao registrar!', 'Por favor, informe o valor para continuar')
    } else if (userId === null) {
      Alert.alert('Erro ao registrar!', 'Por favor, informe o nome do contribuinte para continuar')
    } else {
      //console.log(parseFloat(amount.replace(',','.')))
      try {
        setSpinner(true)
        const response = await api.post('cash', {
          amount,
          userId
        })
        if (response.data.status === 200) {
          Alert.alert('Sucesso!!!', response.data.message)
          setAmount('')
          setUsername('Selecione o contribuinte')
          setUserId(null)
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
      const response = await api.get('users')
      console.log(response.data.users)
      setUsers(response.data.users)

      const entry = await api.get('entry')
      setEntries(entry.data.entries)
      setLoading(false)
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
      <Modal
        visible={showUsers}
        transparent={true}
        animationType={"fade"}
        onRequestClose={ () => { setShowUsers(false) } } >
        <TouchableOpacity activeOpacity={5} onPress={() => { setShowUsers(false) }} style={CENTEREDVIEW}>
          <View style={MODALVIEW}>
            <FlatList
              data={ users }
              style={TYPELIST}
              contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}
              showsVerticalScrollIndicator={true}
              keyExtractor={item => String(item.id)}
              renderItem={({ item: item }) => (
                <>
                  <TouchableOpacity
                    onPress={() => { setUsername(item.name), setUserId(item.id), setShowUsers(false) }}
                    style={{
                      height: 35,
                      width: 350,
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingHorizontal: 12,
                      borderBottomWidth: 0.5,
                      borderBottomColor: color.palette.lightGrey
                    }}>
                    <Text style={{ color: color.palette.lightGrey, fontSize: 15 }}>{item.name}</Text>
                  </TouchableOpacity>
                </>
              )}
            />
            <TouchableOpacity
              onPress={() => {setUsername(''), setUserId(0), setShowUsers(false) }}
              style={{
                height: 35,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 12,
                borderBottomWidth: 0.5,
                borderBottomColor: color.palette.lightGrey
              }}>
              <Text style={{ color: color.palette.lightGrey, fontSize: 15 }}> Não cadastrado no sistema </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      <Screen style={CONTAINER} preset="fixed" statusBar='light-content' barBackground={isDrawerOpen ? (color.palette.green) : color.palette.cyan} backgroundColor={color.palette.cyan}>
        <Header
          headerText='$ Registrar Entrada $'
          style={HEADER}
          titleStyle={HEADER_TITLE}
          rightIcon='menu'
          onRightPress={() => { navigation.openDrawer() }}
        />
        <View style={CONTENT}>
          <Feather name='dollar-sign' size={50} color='#FFF' />
          <Text style={{ color: '#fff', marginVertical: 10, textAlign: 'center', fontSize: 18 }}>Informe abaixo uma entrada de dinheiro</Text>
          <TextInput 
            style={INPUT} 
            multiline={false} 
            returnKeyType='done'
            keyboardType='decimal-pad' 
            keyboardAppearance='dark' 
            value={amount} 
            onChangeText={setAmount} 
            placeholder='Valor em reais' 
          />
          {userId === 0 ?
            <TextInput 
            style={INPUT} 
            multiline={false} 
            keyboardType='default' 
            keyboardAppearance='dark' 
            value={username} 
            onChangeText={setUsername} 
            placeholder='Informe o nome do Contribuinte' 
            /> : null
          }
          <TouchableOpacity 
              style={INPUT} 
              onPress={()=>{setShowUsers(true)}} 
            >
              <Text 
                style={{ 
                  color: '#333', 
                  textAlign: 'center', 
                  fontSize: 20, 
                  marginVertical: 10 
                  }}> {username} </Text> 
            </TouchableOpacity>
          <CommonButton name="Registrar Entrada" style={{ width: '50%', marginBottom: 15 }} onPress={handleSubmit} background={color.palette.cyan} preset="primary" />
          
          <Text style={{ color: '#fff', textAlign: 'center', fontSize: 25, marginBottom: 15 }}>Entradas Registradas</Text>
          {entries.length > 0 ?
            <View style ={{width:'80%', height: '30%', backgroundColor: '#FFF', borderRadius: 15}}>
              <View style={{flexDirection: 'row', width: '100%'}}>
                <Text style={{ textAlign: 'center', width: '50%', fontWeight: '500', color: color.palette.cyan }}> Data </Text>
                <Text style={{ textAlign: 'center', width: '50%',fontWeight: '500', fontSize: 15, color: color.palette.cyan }}> Valor </Text>
              </View>
              <FlatList
                data={ entries }
                style={{
                  width:'100%', paddingTop: 10
                }}
                contentContainerStyle={{
                  alignItems: 'center'
                }}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => String(item.id)}
                renderItem={({ item: item }) => (
                  <>
                    <View style={{flexDirection: 'row', width: '100%', marginBottom: 10}}>
                      <Text style={{ textAlign: 'center', width: '50%', color: '#333', fontWeight: '300' }}>{item.date}</Text>
                      <Text style={{ 
                        textAlign: 'center', 
                        width: '50%', 
                        color: color.palette.green, 
                        fontWeight: '300',
                        }}>R$ {item.amount}</Text>
                    </View>
                  </>
                )}
              />
            </View>
            :
            <View style ={{
              width:'80%', 
              height: '30%', 
              backgroundColor: '#FFF', 
              borderRadius: 15, 
              alignItems: 'center', 
              justifyContent: 'center'
              }}>
                {loading ? 
                  <ActivityIndicator color='#333'/>
                  :
                  <>
                    <Text style={{ 
                              textAlign: 'center', 
                              width: '50%', 
                              fontWeight: '500', 
                              color: color.palette.cyan ,
                              marginBottom: 15
                              }}> 
                              Nenhum lançamento realizado ainda 
                              </Text>
                <Feather name='meh' size={32} color={color.palette.cyan} />
                  </>
                }
            </View>
          }
          
        </View>
      </Screen>
    </View>
  )
})
