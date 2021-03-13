import React, { useState } from "react";
import { View, TextInput, Button, Alert, LogBox} from "react-native";
import { useAuth } from "../providers/AuthProvider";
import styles from "../stylesheet";

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

export function WelcomeView({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, signUp, signIn, partition } = useAuth();

  const redirectTaskList = ()=>{
    if (user && partition) {
      navigation.navigate("Task List", {
        user, partition
      });
    }
  }
  // The onPressSignIn method calls AuthProvider.signIn with the
  // email/password in state.
  const onPressSignIn = async () => {
    try {
      console.log("Tentou logar ...");
      await signIn(email, password, redirectTaskList);
      console.log("Logadooo ...");
    } catch (error) {
      console.log(error.message);
      Alert.alert(`Failed to sign in: ${error.message}`);
    }
  };

  // The onPressSignUp method calls AuthProvider.signUp with the
  // email/password in state and then signs in.
  const onPressSignUp = async () => {
    try {
      console.log("Tentou cadastrar ...");
      await signUp(email, password);
      signIn(email, password);
      redirectTaskList();
      console.log("Cadastradooo ...");
    } catch (error) {
      console.log(error.message);
      Alert.alert(`Failed to sign up: ${error.message}`);
    }
  };

  return (
    <View style={styles.viewTop}>
      <View style={styles.inputContainer}>
        <TextInput
          onChangeText={setEmail}
          value={email}
          placeholder="Email"
          style={styles.inputStyle}
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          onChangeText={(text) => setPassword(text)}
          value={password}
          placeholder="Senha"
          style={styles.inputStyle}
          secureTextEntry
        />
      </View>
      <View style={styles.buttonWrapperFather}>
        <View style={styles.buttonsWrapper}>
          <Button onPress={onPressSignIn} color="#218838" title="Login"/>
        </View>
        <View style={styles.buttonsWrapper}>
          <Button onPress={onPressSignUp} title="Cadastrar" />
        </View>
      </View>
    </View>
  );
}
