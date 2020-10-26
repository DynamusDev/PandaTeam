import React, { useEffect, useState } from "react"
import { Image, ImageStyle, Platform, TextStyle, View, ViewStyle, AsyncStorage, Alert, TouchableOpacity, TextInput, Clipboard } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { BulletItem, Button, Header, Text, Screen, Wallpaper, Icon, CommonButton } from "../../components"
import { color, spacing } from "../../theme"
import { api } from "../../services/api"
import { save } from "../../utils/storage"
import { useIsDrawerOpen } from '@react-navigation/drawer'
import CheckBox from 'react-native-check-box'
import Spinner from 'react-native-loading-spinner-overlay'
import { Snackbar } from 'react-native-paper';

const FULL: ViewStyle = { flex: 1, backgroundColor: '#fff', }
const CONTAINER: ViewStyle = {
  flex: 1,
}
const CONTENT: ViewStyle = {
  flex: 1,
  backgroundColor: '#DADADA',
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

export const Payment = observer(function Payment() {
  const navigation = useNavigation()
  const goBack = () => navigation.goBack()
  const isDrawerOpen = useIsDrawerOpen()
  const [visible, setVisible] = useState(false)

  const agencia = '2552'
  const conta = '0002969-2'


  return (
    <View style={FULL}>
      <Screen style={CONTAINER} preset="fixed" statusBar='light-content' barBackground={isDrawerOpen ? (color.palette.green) : color.palette.cyan} backgroundColor={color.palette.cyan}>
        <Header
          headerText='Informações de Transferência'
          style={HEADER}
          titleStyle={HEADER_TITLE}
          rightIcon='menu'
          onRightPress={() => { navigation.openDrawer() }}
        />
        <View style={CONTENT}>
            <Text style={{ 
                    textAlign: 'center', 
                    width: '100%',
                    fontWeight: 'bold', 
                    color: color.palette.cyan ,
                    marginBottom: 10,
                    fontSize: 18
                    }}> 
                    Banco
              </Text>
              <Text style={{ 
                textAlign: 'center', 
                width: '100%',
                fontWeight: '400', 
                color: color.palette.cyan ,
                marginBottom: 10,
                fontSize: 18
                }}> 
                Itaú
              </Text>
              <TouchableOpacity onLongPress={() => {Clipboard.setString(agencia), setVisible(true)}} style={{alignItems: 'center'}}>
                <Text style={{ 
                      textAlign: 'center', 
                      width: '100%',
                      fontWeight: 'bold', 
                      color: color.palette.cyan ,
                      marginBottom: 10,
                      fontSize: 18
                      }}> 
                      Agência
                </Text>
                <Text style={{ 
                  textAlign: 'center', 
                  width: '100%',
                  fontWeight: '400', 
                  color: color.palette.cyan ,
                  marginBottom: 10,
                  fontSize: 18
                  }}> 
                  {agencia}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onLongPress={() => {Clipboard.setString(conta), setVisible(true)}} style={{alignItems: 'center'}}>
              <Text style={{ 
                    textAlign: 'center', 
                    width: '100%',
                    fontWeight: 'bold', 
                    color: color.palette.cyan ,
                    marginBottom: 10,
                    fontSize: 18
                    }}> 
                    Conta Corrente
              </Text>
              <Text style={{ 
                textAlign: 'center', 
                width: '100%',
                fontWeight: '400', 
                color: color.palette.cyan ,
                marginBottom: 10,
                fontSize: 18
                }}> 
                {conta}
              </Text>
            </TouchableOpacity>
            <Text style={{ 
                  textAlign: 'center', 
                  width: '100%',
                  fontWeight: 'bold', 
                  color: color.palette.cyan ,
                  marginBottom: 10,
                  fontSize: 18
                  }}> 
                  Favorecido
            </Text>
            <Text style={{ 
              textAlign: 'center', 
              width: '100%',
              fontWeight: '400', 
              color: color.palette.cyan ,
              marginBottom: 10,
              fontSize: 18
              }}> 
              JAQUELINE MELO KURAMOTO
            </Text>
            <Snackbar
              visible={visible}
              onDismiss={()=>{setVisible(false)}}
            >
            Copiado
            </Snackbar>
        </View>
      </Screen>
    </View>
  )
})
