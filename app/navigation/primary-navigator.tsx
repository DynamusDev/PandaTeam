/**
 * This is the navigator you will modify to display the logged-in screens of your app.
 * You can use RootNavigator to also display an auth flow or other user flows.
 *
 * You'll likely spend most of your time in this file.
 */
import React, { useState, useEffect } from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer'
import Feather from '@expo/vector-icons/Feather'
import { WelcomeScreen, DemoScreen, SignUp, Users } from "../screens"
import { useNavigation } from "@react-navigation/native"
import AsyncStorage from "@react-native-community/async-storage"
import { SafeAreaView, Text, Image, View, Alert } from "react-native"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import { Icon, HeaderButton } from "../components"
import { color } from "../theme/color"
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { api } from "../services/api"

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 */
export type PrimaryParamList = {
  welcome: undefined
  demo: undefined
  drawer: undefined
  home: undefined
  signUp: undefined
  users: undefined
}

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createStackNavigator<PrimaryParamList>()
const Draw = createDrawerNavigator<PrimaryParamList>()

export function Drawer() {
  const [user, setUser] = useState([])
  const navigation = useNavigation()
  function logout() {
    AsyncStorage.clear()
    navigation.navigate('welcome')
  };

  

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

  const getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        Alert.alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };

  const _pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0,
        base64:true
      });

      if (!result.cancelled) {
        try{
          const value = await AsyncStorage.getItem('id');
          if (value != null) {
            const response = await api.put(`/updateImage/${user.id}`, {
              avatar: result.base64,
              })
            Alert.alert('Sucesso!!!', response.data.message)

            const data = await api.get(`users/${user.id}`)
            setUser(response.data.user)
            }
        }catch(error){
          console.log(error)
        }
      }

    } catch (E) {
      console.log(E);
    }
  };


  const customDrawerComponent = props => (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.palette.green }}>
      <ScrollView>
        <View style={{width: '100%', height: 80, alignItems: 'center', justifyContent: 'center', marginBottom: 15}}>
          <TouchableOpacity onPress={_pickImage} style={{ width: 80, height: 80, borderRadius: 50 }}>
            <Image
              style={{ width: 80, height: 80, borderRadius: 50 }}
              source={{ uri: `data:image/gif;base64,${user.avatar}` }}
              resizeMode='contain'
              resizeMethod='scale'
            />
          </TouchableOpacity>
        </View>
        <DrawerItemList {...props} />
        <TouchableOpacity onPress={()=>{}} style={{ height: 40, flexDirection: 'row', justifyContent: 'flex-start', width: '100%', paddingHorizontal: 17, marginTop: 15 }}>
          <Feather name='users' size={25} color='#FFF' />
          <Text style={{ color: '#fff', fontWeight: '500', height: '100%', marginTop: 5, marginLeft: 35 }}>Panda Team</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{}} style={{ height: 40, flexDirection: 'row', justifyContent: 'flex-start', width: '100%', paddingHorizontal: 17, marginTop: 15 }}>
          <Feather name='dollar-sign' size={25} color='#FFF' />
          <Text style={{ color: '#fff', fontWeight: '500', height: '100%', marginTop: 5, marginLeft: 35 }}>Entradas</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={logout} style={{ height: 40, flexDirection: 'row', justifyContent: 'flex-start', width: '100%', paddingHorizontal: 17, marginTop: 15 }}>
          <Feather name='log-out' size={25} color='#FFF' />
          <Text style={{ color: '#fff', fontWeight: '500', height: '100%', marginTop: 5, marginLeft: 35 }}>Sair</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )

  return (
    <Draw.Navigator initialRouteName="home"
      drawerPosition='right'
      drawerContent= {customDrawerComponent}
      drawerContentOptions={{
        activeTintColor: '#fff' ,
        inactiveTintColor: '#fff',
        activeBackgroundColor: color.palette.cyan,

        itemStyle: { marginVertical: 5, alignItems: "flex-start", justifyContent: "center" },
        labelStyle: { 
          color: '#fff',
          marginTop: 5 
          },
        
        contentContainerStyle: { justifyContent: 'center' }
      }}
      drawerStyle={{
        width: '65%'
      }}
      screenOptions={({ route }) => ({
        drawerIcon: ({ color, size }) => {
          let iconName
          if (route.name === 'home') {
            iconName = 'home'
          } else if (route.name === 'signUp') {
            iconName = 'user-plus'
          } else if (route.name === 'users') {
            iconName = 'users'
          } 

          // You can return any component that you like here!
          return <Feather name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Draw.Screen name="home" options={{ title: 'Início' }} component={DemoScreen} />
      <Draw.Screen name="signUp" options={{ title: 'Registrar Membro' }} component={SignUp} />
      {/* <Draw.Screen name="users" options={{ title: 'Panda Team' }} component={Users} /> */}
    </Draw.Navigator>
  )
}

export function PrimaryNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="welcome" component={WelcomeScreen} />
      <Stack.Screen name="drawer" component={Drawer} />
    </Stack.Navigator>
  )
}

/**
 * A list of routes from which we're allowed to leave the app when
 * the user presses the back button on Android.
 *
 * Anything not on this list will be a standard `back` action in
 * react-navigation.
 *
 * `canExit` is used in ./app/app.tsx in the `useBackButtonHandler` hook.
 */
const exitRoutes = ["welcome"]
export const canExit = (routeName: string) => exitRoutes.includes(routeName)
