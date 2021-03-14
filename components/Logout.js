import * as React from "react";
import { Button, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../providers/AuthProvider";
import { View } from "react-native";
import styles from "../stylesheet";

export function Logout() {
  const navigation = useNavigation();
  const { signOut } = useAuth();

  return (
    <View style={styles.logoutButtonWrapper}>
      <Button
        title="Sair"
        onPress={() => {
          Alert.alert("Tem certeza que deseja sair desse sistema incrível?", null, [
            {
              text: "Infelizmente sim!",
              style: "destructive",
              onPress: () => {
                signOut();
                navigation.navigate('Welcome View');
              },
            },
            { text: "Pensando bem, vou ficar mais um pouco!", style: "cancel" },
          ]);
        }}
        />
    </View>
  );
}