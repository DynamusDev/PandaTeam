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
          TouchableOpacity, 
          TextInput,
          FlatList, Modal
        } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { BulletItem, Button, Header, Text, Screen, Wallpaper, Icon, CommonButton } from "../../components"
import { color, spacing } from "../../theme"
import { api } from "../../services/api"
import { save } from "../../utils/storage"
import { useIsDrawerOpen } from '@react-navigation/drawer';
import CheckBox from 'react-native-check-box'
import Spinner from 'react-native-loading-spinner-overlay'

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
  flex:1,
  width:'100%',
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
  width:300,
  height:400,
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
  paddingBottom: spacing[3] ,
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
  const date = new Date(time);
  return date.toISOString().split('T')[0];
}

export const Users = observer(function Users() {
  const navigation = useNavigation()
  const goBack = () => navigation.goBack()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [admin, setAdmin] = useState(false)
  const [spinner, setSpinner] = useState(false)
  const [modalVisible, setModalVisible] = useState(false);
  const [users, setUsers] = useState([])
  const [user, setUser] = useState([])
  const hoje = new Date()
  const isDrawerOpen = useIsDrawerOpen()

  async function handleSubmit() {
    if(name === '') {
      Alert.alert('Erro ao registrar!', 'Por favor, informe o nome do membro para continuarmos com o registro')
    }else if(email === '') {
      Alert.alert('Erro ao registrar!', 'Por favor, informe o email do membro para continuarmos com o registro')
    }else{
      try {
        setSpinner(true)
        const response = await api.post('sign_up', {
          name,
          email,
          admin
        })
        if(response.data.status === 200) {
          Alert.alert('Sucesso!!!', response.data.message)
          setEmail('')
          setName('')
          setAdmin(false)
          setSpinner(false)
        }else if(response.data.status === 400){
          setSpinner(false)
          Alert.alert('Erro ao registrar!!!', response.data.error)
        }else if(response.data.status === 401){
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
        onRequestClose={ () => { setModalVisible(false)} } >
        <View style={CENTEREDVIEW}>
          <View style={MODALVIEW}>
            
          </View>
        </View>
      </Modal>
      <Spinner
        visible={spinner}
        textContent={'Loading...'}
        animation={'slide'}
        textStyle={{ color: '#FFF' }}
        overlayColor={'rgba(0,0,0,0.80)'}
      />
      <Screen style={CONTAINER} preset="scroll" statusBar='light-content' barBackground={isDrawerOpen ? (color.palette.green) : color.palette.cyan} backgroundColor={color.palette.cyan}>
        <Header
          headerText='Panda Team!!! '
          style={HEADER}
          titleStyle={HEADER_TITLE}
          rightIcon='menu'
          onRightPress={()=>{navigation.openDrawer()}}
        />
        <View style={CONTENT}>
        <FlatList
            data={ users }
            style={USERLIST}
            contentContainerStyle={{
              alignItems: 'center',
              justifyContent: 'center'
            }}
            showsVerticalScrollIndicator={false}
            keyExtractor={user => String(user)}
            renderItem={({item:users}) => (
              <View style={{
                maxHeight: 100,
                alignItems: 'center', 
                backgroundColor:'#E6E7E8',
                marginTop: 15,
                width: 350,
                borderRadius: 10,
                }}>
                <TouchableOpacity
                  onPress={() => {  }}
                  style={{
                          flexDirection:'row',
                          alignItems:'center',
                          paddingHorizontal:5,
                          paddingVertical: 5,
                          borderRadius: 10,
                          }}>
                      <Image
                        style={{width:60,
                                height:60,
                                borderRadius:30,
                                borderColor:'#000',
                                marginRight: 20, }}
                        source={{uri: `data:image/gif;base64,${users.avatar}`}}
                        resizeMode='contain'/>
                      <View>
                        <Text style={{color:'#58595B', fontSize:20, fontWeight:'bold' }}>{users.name}</Text>
                        <Text style={{color:'#58595B', fontSize:15 }}>{users.email}</Text>
                      </View>
                </TouchableOpacity>
              {user.admin === true ? (
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity 
                    style={{
                      height: 30, 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      width: '20%',
                    }}
                    onPress={()=>{Alert.alert('teste', 'teste')}}
                  >
                    <Text style={{color:'#58595B', fontSize:15 }}>editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={{
                      height: 30, 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      width: '20%',
                    }}
                    onPress={()=>{Alert.alert('teste', 'teste')}}
                  >
                    <Text style={{color:'#58595B', fontSize:15 }}>excluir</Text>
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