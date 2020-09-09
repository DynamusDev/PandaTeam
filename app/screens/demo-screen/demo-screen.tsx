import React, { useEffect, useState } from "react"
import { Image, ImageStyle, Platform, TextStyle, View, ViewStyle, AsyncStorage, Alert, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { BulletItem, Button, Header, Text, Screen, Wallpaper } from "../../components"
import { color, spacing } from "../../theme"
import {Calendar, CalendarList, Agenda, LocaleConfig} from 'react-native-calendars';
import { api } from "../../services/api"
import { save } from "../../utils/storage"
import { useIsDrawerOpen } from '@react-navigation/drawer';

LocaleConfig.locales['br'] = {
  monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
  monthNamesShort: ['Jan.','Fev.','Mar','Abr','Mai','Jun','Jul.','Ago','Set.','Out.','Nov.','Dez.'],
  dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
  dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sab'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'br';

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
  paddingBottom: spacing[3] ,
  paddingHorizontal: spacing[3],
  backgroundColor: color.palette.cyan
}
const HEADER_TITLE: TextStyle = {
  fontSize: 20,
  textAlign: "center",
  letterSpacing: 1.5,
}

const timeToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split('T')[0];
}

export const DemoScreen = observer(function DemoScreen() {
  const navigation = useNavigation()
  const goBack = () => navigation.goBack()
  const [user, setUser] = useState([])
  const [name, setName] = useState([])
  const [items, setItems] = useState([])
  const [events, setEvents] = useState([])
  const hoje = new Date()
  const isDrawerOpen = useIsDrawerOpen()

  async function loadItems(day){
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);
        if (!items[strTime]) {
          items[strTime] = [];
          const numItems = Math.floor(Math.random() * 3 + 1);
          for (let j = 0; j < numItems; j++) {
            items[strTime].push({
              name: 'Evento - clique para ver a descrição',
              height: Math.max(50, Math.floor(Math.random() * 150))
            });
          }
        }
      }
      const newItems = [];
      Object.keys(items).forEach(key => {newItems[key] = items[key];});
      setItems(newItems)
    }, 1000);
  }

  const renderItem = (item) => {
    return(
      <TouchableOpacity style={{
                                marginTop: 17,
                                marginRight: 10
                              }}>
        <View style={{
                      height: 60,
                      width: '100%',
                      padding: 5,
                      borderRadius: 5,
                      flexDirection: 'row',
                      backgroundColor: '#fff', 
                      alignItems: 'center', 
                      justifyContent: 'center'
                      }}>
          <Text style={{color: '#333'}}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  useEffect(() => {
    async function retrieveData() {
      const myArray = await AsyncStorage.getItem('user')
      if (myArray !== null) {
        // We have data!!
        const usuário = JSON.parse(myArray)
        setUser(usuário)
        setName(usuário.name.split(" ")[0])
      }
    };
    retrieveData()
  }, [])

  return (
    <View style={FULL}>
      <Screen style={CONTAINER} preset="scroll" statusBar='light-content' barBackground={isDrawerOpen ? (color.palette.green) : color.palette.cyan} backgroundColor={color.palette.cyan}>
        <Header
          headerText={`Olá, ${name}`}
          style={HEADER}
          titleStyle={HEADER_TITLE}
          rightIcon='menu'
          onRightPress={()=>{navigation.openDrawer()}}
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
            Valor em caixa <Text style={{fontWeight: '600', color: '#333', fontSize: 20,}}>R$100,00</Text>
          </Text>
          <Agenda
            items={items}
            loadItemsForMonth={loadItems}
            selected={hoje}
            refreshing={false}
            renderItem={renderItem}
            />
        </View>
      </Screen>
    </View>
  )
})