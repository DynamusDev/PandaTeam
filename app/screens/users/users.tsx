/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from "react"
import {
  Image,
  ImageStyle,
  Platform,
  TextStyle,
  View,
  ViewStyle,
  AsyncStorage,
  Alert,
  FlatList, Modal
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { Header, Text, Screen, CommonButton, HeaderButton, Loading } from "../../components"
import { color, spacing } from "../../theme"
import { api } from "../../services/api"
import { useIsDrawerOpen } from '@react-navigation/drawer'
import Spinner from 'react-native-loading-spinner-overlay'
import { TextInput, TouchableOpacity } from "react-native-gesture-handler"
import CheckBox from 'react-native-check-box'
import { event } from "react-native-reanimated"

const FULL: ViewStyle = { flex: 1, backgroundColor: '#fff', }
const CONTAINER: ViewStyle = {
  flex: 1,
}
const CONTENT: ViewStyle = {
  flex: 1,
  backgroundColor: '#fff',
  alignItems: 'center',
  justifyContent: 'center'
}
const USERLIST: ViewStyle = {
  flex: 1,
  width: '100%',
}
const CENTEREDVIEW: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  marginTop: 22
}
const MODALVIEW: ViewStyle = {
  margin: 20,
  backgroundColor: "#00368E",
  borderRadius: 20,
  width: 300,
  height: 400,
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
const USERCONTAINER: ViewStyle = {
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

const AVATAR: ViewStyle = {
  width: '100%',
  height: 80,
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 15
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
  padding: 35,
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
  height: '50%',
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
  backgroundColor: '#E2E2E0'
}
const ALERTTEXT: TextStyle = {
  width: '80%',
  textAlignVertical: 'center',
  textAlign: "center",
  fontWeight: '600',
  fontSize: 20,
  color: color.palette.white
}
const HEADERMODAL: ViewStyle = {
  flexDirection: 'row',
  height: '10%',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-between',
}
const SEPARATE: ViewStyle = {
  width: 32,
  height: 10
}

export const Users = observer(function Users() {
  const navigation = useNavigation()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [id, setId] = useState('')
  const [admin, setAdmin] = useState(null)
  const [showAlert, setShowAlert] = useState(false)
  const [spinner, setSpinner] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [userForExclude, setUserForExclude] = useState(null)
  const [users, setUsers] = useState([])
  const [user, setUser] = useState([])
  const hoje = new Date()
  const isDrawerOpen = useIsDrawerOpen()

  async function loadUsers() {
    setSpinner(true)
    const response = await api.get('users')
    setUsers(response.data.users)
    setSpinner(false)
  };

  async function deleteUser(item) {
    setSpinner(true)
    try {
      const delet = await api.delete(`users/${item.id}`)
      const response = await api.get('users')
      setUsers(response.data.users)
      setSpinner(false)
      Alert.alert('Sucesso!!!', 'O usuário foi deletado do sistema')
    } catch (err) {
      console.log(err)
      setSpinner(false)
      Alert.alert('Erro ao excluir usuário', 'Por favor, tente novamente')
    }
  }

  async function handleSubmit() {
    setShowAlert(false)
    setSpinner(true)
    if (name === '') {
      Alert.alert('Erro ao registrar!', 'Por favor, informe o nome do membro para continuarmos com o registro')
    } else if (email === '') {
      Alert.alert('Erro ao registrar!', 'Por favor, informe o email do membro para continuarmos com o registro')
    } else {
      try {
        setSpinner(true)
        const response = await api.put(`usersEdit/${id}`, {
          name,
          email,
          admin
        })
        if (response.data.status === 200) {
          Alert.alert('Sucesso!!!', response.data.message)
          setEmail('')
          setName('')
          setId('')
          setAdmin(false)
          const users = await api.get('users')
          setUsers(users.data.users)
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
      const response = await api.get('users')
      setUsers(response.data.users)
    };
    retrieveData()
  }, [])

  return (
    <View style={FULL}>
      
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType={"fade"}
        onRequestClose={ () => { setModalVisible(false) } } >
        <View style={CENTEREDVIEW}>
          <View style={MODALVIEW}>

          </View>
        </View>
      </Modal>
      {
        spinner && <Loading text='Carregando' animation={Platform.OS === 'ios' ? 'panda' : 'rocket'}/>
      }
          <Screen style={CONTAINER} preset="fixed" statusBar='light-content' barBackground={isDrawerOpen ? (color.palette.green) : color.palette.cyan} backgroundColor={color.palette.cyan}>
          <Modal
            visible={showAlert}
            transparent={true}
            animationType={"fade"}
            onRequestClose={ () => { setShowAlert(false) } } >
            <View style={ALERTCENTEREDT}>
              <View style={ALERTVIEWT}>
                <View style={HEADERMODAL}>
                  <View style={SEPARATE} />
                  <Text style={ALERTTEXT}>Editar Usuário</Text>
                  <HeaderButton name='close' onPress={() => { setShowAlert(false) }} />
                </View>
                <TextInput
                  style={INPUT} 
                  multiline={false} 
                  autoCapitalize='words' 
                  value={name} 
                  onChangeText={setName} 
                  placeholderTextColor={color.palette.cyan} 
                  placeholder='Nome' 
                />
                <TextInput 
                  style={INPUT} 
                  autoCompleteType='email' 
                  keyboardType='email-address' 
                  multiline={false} 
                  autoCapitalize='none' 
                  value={email} 
                  onChangeText={setEmail} 
                  placeholderTextColor={color.palette.cyan} 
                  placeholder='Email' 
                />
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 40, width: '100%' }}>
                  {admin === true ? (
                    <Text style={{ color: '#333', marginVertical: 10, textAlign: 'center', fontSize: 18 }}>Retirar os privilégios de admin?</Text>
                  ) : <Text style={{ color: '#333', marginVertical: 10, textAlign: 'center', fontSize: 18 }}>Tornar este usuário um admin?</Text>
                  }
                  <CheckBox
                    style={{ padding: 10, height: 10 }}
                    onClick={() => { setAdmin(!admin) }}
                    isChecked={admin}
                    leftText={"Este usuário é um adm?"}
                  />
                </View>
                <CommonButton name="Atualizar" style={{ width: '50%' }} onPress={() => { handleSubmit() }} background={color.palette.cyan} preset="primary" />
              </View>
            </View>
          </Modal>
          <Header
            headerText='Panda Team!!! '
            style={HEADER}
            titleStyle={HEADER_TITLE}
            rightIcon='menu'
            onRightPress={() => { navigation.openDrawer() }}
          />
          <View style={CONTENT}>
            <FlatList
              data={ users }
              style={USERLIST}
              contentContainerStyle={{
                alignItems: 'center',
                justifyContent: 'center'
              }}
              refreshing={false}
              onRefresh={loadUsers}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => String(item.id)}
              renderItem={({ item }) => (
                <View style={{
                  maxHeight: 100,
                  alignItems: 'center',
                  backgroundColor: '#E6E7E8',
                  marginTop: 15,
                  width: 350,
                  borderRadius: 10,
                }}>
                  <TouchableOpacity
                    onPress={() => { }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 5,
                      paddingVertical: 5,
                      borderRadius: 10,
                    }}>
                    <Image
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        borderColor: '#000',
                        marginRight: 20,
                      }}
                      source={{ uri: `data:image/gif;base64,${item.avatar}` }}
                      resizeMode='contain'/>
                    <View>
                      <Text style={{ color: '#58595B', fontSize: 20, fontWeight: 'bold' }}>{item.name}</Text>
                      <Text style={{ color: '#58595B', fontSize: 15, width: 230 }}>{item.email}</Text>
                    </View>
                  </TouchableOpacity>
                  {user.admin === true && user.id !== item.id ? (
                    <View style={{ flexDirection: 'row', width: '40%', justifyContent: 'space-between' }}>
                      <TouchableOpacity
                        style={{
                          height: 30,
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 'auto',
                        }}
                        onPress={() => { 
                          setId(item.id)
                          setName(item.name)
                          setEmail(item.email)
                          setAdmin(item.admin)
                          setShowAlert(true) 
                        }}
                      >
                        <Text style={{ color: color.palette.orange, fontSize: 15 }}>editar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          height: 30,
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 'auto',
                        }}
                        //onPress={(item) => { deleteUser(item)}}
                        onPress={() =>{
                          Alert.alert(
                            'Atenção',
                            'Tem certeza de que deseja excluir este usuário do sistema?',
                            [
                              {
                                text: 'Sim, excluir',
                                onPress: () => { deleteUser(item)}
                              },
                              {
                                text: 'Cancelar',
                                onPress: () => console.log('Cancel Pressed'),
                                style: 'cancel'
                              },
                            ],
                            { cancelable: false }
                          );
                        }}
                      >
                        <Text style={{ color: color.palette.Emergência, fontSize: 15 }}>excluir</Text>
                      </TouchableOpacity>
                    </View>
                  ) : null
                  }
                </View>
              )}
            />
          </View>
        </Screen>
    </View>
  )
})
