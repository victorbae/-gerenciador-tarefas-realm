import * as React from "react";
import { Button, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../providers/AuthProvider";
import styles from "../stylesheet";
import { View } from "react-native";

export function Logout() {
  const navigation = useNavigation();
  const { signOut } = useAuth();

  return (
    <View style={styles.logoutWrapperButton}>
      <Button
        title="Sair"
        onPress={() => {
          Alert.alert("Deseja realmente sair desse sistema incrivel?", null, [
            {
              text: "Infelizmente sim!",
              style: "destructive",
              onPress: () => {
                signOut();
                navigation.popToTop();
              },
            },
            { text: "Vou ficar mais um pouco!", style: "cancel" },
          ]);
        }}
        />
    </View>
  );
}
