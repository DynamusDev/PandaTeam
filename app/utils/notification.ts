import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import { Platform } from 'react-native'

const getPushNotificationPermissions = async () => {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;

  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== "granted") {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== "granted") {
    return;
  }

  if (Platform.OS === "android") {
    Notifications.createChannelAndroidAsync("PandaTeam", {
      name: "PandaTeam",
      sound: true,
      priority: "max",
      vibrate: [0, 250, 250, 250],
    });
  }

  const token = await Notifications.getExpoPushTokenAsync();
  return token;
};

export default getPushNotificationPermissions;
