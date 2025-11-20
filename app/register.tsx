import AppText from "@/components/AppText";
import { useAuth } from "@/context/AuthContext"; // 👈 importá el hook
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function RegisterScreen() {
  const [nombre, setNombre] = useState("");
  const [apodo, setApodo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // 👈 estado de carga

  const { signUp } = useAuth(); // 👈 obtenemos la función signUp del contexto

  const handleRegister = async () => {
    // Validaciones básicas
    if (!nombre.trim() || !apodo.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Error", "Por favor completá todos los campos");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      await signUp(email, password);
      // 🎉 Si llegamos acá, el usuario fue creado exitosamente
      // Opcionalmente podés guardar nombre y apodo en una tabla "profiles" en Supabase
      // (lo vemos después si querés)
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al registrar tu cuenta");
    } finally {
      setIsLoading(false);
    }
  };

  const getInputStyle = (fieldName) => [
    styles.input,
    { borderColor: focusedInput === fieldName ? "#00AEEF" : "#7B94A4" },
  ];

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <AppText variant="medium" style={styles.title}>
        Crear cuenta
      </AppText>

      <TextInput
        style={getInputStyle("nombre")}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        onFocus={() => setFocusedInput("nombre")}
        onBlur={() => setFocusedInput(null)}
        editable={!isLoading}
      />

      <TextInput
        style={getInputStyle("apodo")}
        placeholder="Apodo"
        value={apodo}
        onChangeText={setApodo}
        onFocus={() => setFocusedInput("apodo")}
        onBlur={() => setFocusedInput(null)}
        editable={!isLoading}
      />

      <TextInput
        style={getInputStyle("email")}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        onFocus={() => setFocusedInput("email")}
        onBlur={() => setFocusedInput(null)}
        editable={!isLoading}
      />

      {/* Contraseña con ojo 👁️ */}
      <View
        style={[
          getInputStyle("password"),
          { flexDirection: "row", alignItems: "center", paddingVertical: 10 },
        ]}
      >
        <TextInput
          style={{ flex: 1, fontSize: 16, paddingVertical: 0 }}
          placeholder="Contraseña"
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
          onFocus={() => setFocusedInput("password")}
          onBlur={() => setFocusedInput(null)}
          editable={!isLoading}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={22}
            color="#00AEEF"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, isLoading && { opacity: 0.6 }]}
        onPress={handleRegister}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <AppText variant="semibold" style={styles.buttonText}>
            Registrate
          </AppText>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  logo: {
    width: 120,
    height: 60,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    color: "#333",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#00BFFF",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    letterSpacing: 1,
  },
});